import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir, tmpdir } from 'os'
import { withRetry, type RetryOptions } from './retry-with-backoff'

// ─── Types ─────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface CreateChatCompletionBody {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  max_tokens?: number
  thinking?: { type: string }
  stream?: boolean
}

// ─── Retry options ─────────────────────────────────────────────────────

const AI_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 5,
  baseDelay: 1500,
  maxDelay: 25000,
  retryableCodes: [
    'ResourceExhausted',
    'TooManyRequests',
    'ServiceUnavailable',
    'RATE_LIMIT',
    'rate_limit_exceeded',
    'overloaded',
    'concurrency threshold',
  ],
  retryableStatuses: [429, 502, 503, 504],
}

// ─── Helper: check response body for hidden errors ─────────────────────
/**
 * Certaines APIs (DashScope, Alibaba Cloud) retournent HTTP 200
 * avec une erreur dans le body JSON : {"Code":"ResourceExhausted",...}
 * Cette fonction détecte ce cas et lève une erreur retentable.
 */
function checkResponseForErrors(response: any): void {
  if (!response || typeof response !== 'object') return

  // Cas 1 : { Code: "ResourceExhausted", Message: "..." }
  const code = response.Code || response.code || response.error?.code
  if (code && typeof code === 'string') {
    const retryableCodes = AI_RETRY_OPTIONS.retryableCodes || []
    const isRetryable = retryableCodes.some(c =>
      code.toLowerCase().includes(c.toLowerCase())
    )
    if (isRetryable) {
      const err = new Error(`AI Error [${code}]: ${response.Message || response.message || ''}`)
      ;(err as any).Code = code
      ;(err as any).status = 429
      ;(err as any).statusCode = 429
      throw err
    }
  }

  // Cas 2 : OpenAI-style { error: { type: "...", message: "..." } }
  if (response.error && typeof response.error === 'object') {
    const errType = String(response.error.type || '')
    const errMsg = String(response.error.message || '')
    const combined = `${errType} ${errMsg}`.toLowerCase()
    const retryableCodes = AI_RETRY_OPTIONS.retryableCodes || []
    const isRetryable = retryableCodes.some(c => combined.includes(c.toLowerCase()))
    if (isRetryable) {
      const err = new Error(`AI Error: ${errMsg}`)
      ;(err as any).Code = errType
      ;(err as any).status = 429
      throw err
    }
  }
}

// ─── Helper: wrap any zai instance with retry ─────────────────────────
/**
 * Crée un proxy autour de n'importe quelle instance ZAI (SDK ou FetchAI)
 * qui ajoute automatiquement le retry + la détection d'erreurs dans le body.
 */
function createResilientWrapper(rawZai: any): any {
  return {
    chat: {
      completions: {
        create: async (body: CreateChatCompletionBody): Promise<any> => {
          return withRetry(async () => {
            const response = await rawZai.chat.completions.create(body)

            // Vérifier si la réponse contient une erreur cachée (HTTP 200 + erreur dans body)
            checkResponseForErrors(response)

            return response
          }, AI_RETRY_OPTIONS)
        },
      },
    },
    // Passer les autres méthodes sans wrapping (audio, functions, images, etc.)
    audio: rawZai.audio,
    functions: rawZai.functions,
    images: rawZai.images,
  }
}

// ─── Lightweight fetch-based client ─────────────────────────────────────

class FetchAI {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.apiKey = apiKey
  }

  get chat() {
    return {
      completions: {
        create: async (body: CreateChatCompletionBody): Promise<any> => {
          const { thinking, stream, ...payload } = body as any

          const res = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              model: payload.model || 'mistral-large-latest',
              ...payload,
            }),
          })

          const text = await res.text()
          let data: any

          try {
            data = JSON.parse(text)
          } catch {
            if (!res.ok) {
              const err = new Error(`AI API ${res.status}: ${text.slice(0, 300)}`)
              ;(err as any).status = res.status
              throw err
            }
            return { choices: [] }
          }

          // Vérifier les erreurs dans le body (même sur HTTP 200)
          checkResponseForErrors(data)

          if (!res.ok) {
            const err = new Error(`AI API ${res.status}: ${text.slice(0, 300)}`)
            ;(err as any).Code = data?.Code || data?.error?.code
            ;(err as any).status = res.status
            throw err
          }

          return data
        },
      },
    }
  }

  get audio() {
    return {
      asr: {
        create: async (_params: { file_base64: string }): Promise<any> => {
          throw new Error('ASR (speech-to-text) requires the Z.ai platform.')
        },
      },
    }
  }

  get functions() {
    return {
      invoke: async (_name: string, _args: any): Promise<any> => {
        throw new Error('AI functions (web_search, page_reader) require the Z.ai platform.')
      },
    }
  }

  get images() {
    return {
      generations: {
        create: async (_params: any): Promise<any> => {
          throw new Error('Image generation requires the Z.ai platform.')
        },
      },
    }
  }
}

// ─── Singleton ─────────────────────────────────────────────────────────

let zaiInstance: any = null
let initAttempted = false
let initError: string | null = null

function readConfig(): { baseUrl: string; apiKey: string } | null {
  const baseUrl = process.env.AI_BASE_URL || process.env.ZAI_BASE_URL
  const apiKey = process.env.AI_API_KEY || process.env.ZAI_API_KEY
  if (baseUrl && apiKey) return { baseUrl, apiKey }

  const paths = [
    '.z-ai-config',
    join(homedir(), '.z-ai-config'),
    '/etc/.z-ai-config',
    join(tmpdir(), '.z-ai-config'),
  ]
  for (const p of paths) {
    try {
      if (existsSync(p)) {
        const data = JSON.parse(readFileSync(p, 'utf-8'))
        if (data.baseUrl && data.apiKey) return { baseUrl: data.baseUrl, apiKey: data.apiKey }
      }
    } catch { /* skip */ }
  }

  return null
}

/**
 * Get a ready-to-use AI client with automatic retry.
 *
 * - In dev (Z.ai config file): uses the full z-ai-web-dev-sdk, WRAPPED with retry
 * - On Vercel / with env vars: uses FetchAI, WRAPPED with retry
 *
 * ALL paths now have retry + response body error detection.
 */
export async function getZAI() {
  if (zaiInstance) return zaiInstance

  if (initAttempted && initError) {
    throw new Error(initError)
  }

  initAttempted = true
  const config = readConfig()

  if (!config) {
    initError =
      'Configuration IA non trouvée. ' +
      'Ajoutez AI_BASE_URL et AI_API_KEY dans les variables d\'environnement.'
    throw new Error(initError)
  }

  let rawInstance: any

  // Try native SDK first (works in dev with Z.ai internal API)
  if (!process.env.AI_BASE_URL && !process.env.ZAI_BASE_URL) {
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      rawInstance = await ZAI.create()
    } catch (err) {
      console.warn('SDK failed, falling back to fetch client:', err)
      rawInstance = null
    }
  }

  // Fetch-based client fallback
  if (!rawInstance) {
    rawInstance = new FetchAI(config.baseUrl, config.apiKey)
  }

  // ★ POINT CLÉ : wrapper TOUJOURS avec retry, quel que soit le backend
  zaiInstance = createResilientWrapper(rawInstance)
  return zaiInstance
}

export function isZAIConfigured(): boolean {
  if (process.env.AI_BASE_URL && process.env.AI_API_KEY) return true
  if (process.env.ZAI_BASE_URL && process.env.ZAI_API_KEY) return true

  const paths = [
    '.z-ai-config',
    join(homedir(), '.z-ai-config'),
    '/etc/.z-ai-config',
    join(tmpdir(), '.z-ai-config'),
  ]
  for (const p of paths) {
    try {
      if (existsSync(p)) {
        const data = JSON.parse(readFileSync(p, 'utf-8'))
        if (data.baseUrl && data.apiKey) return true
      }
    } catch { /* skip */ }
  }
  return false
}
