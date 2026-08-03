import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir, tmpdir } from 'os'
import { withRetry, type RetryOptions } from './retry-with-backoff'

// ─── Types (mirror SDK interface) ─────────────────────────────────

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface CreateChatCompletionBody {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  วาป_max_tokens?: number
  max_tokens?: number
  thinking?: { type: string }
  stream?: boolean
}

interface ChatCompletionResponse {
  choices: Array<{ message?: { content?: string } }>
}

// ─── Retry options for AI calls ──────────────────────────────────

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

// ─── Lightweight fetch-based client (works with Mistral, OpenAI, etc.) ──

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
        create: async (body: CreateChatCompletionBody): Promise<ChatCompletionResponse> => {
          const { thinking, stream, ...payload } = body as any

          // ── Wrapper avec retry automatique ──
          return withRetry(async () => {
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

            if (!res.ok) {
              const text = await res.text()

              // Essayer de parser l'erreur JSON pour propager le bon code
              try {
                const parsed = JSON.parse(text)
                if (parsed.Code) {
                  const err = new Error(`AI API ${res.status}: ${parsed.Code} - ${parsed.Message}`)
                  ;(err as any).Code = parsed.Code
                  ;(err as any).status = res.status
                  throw err
                }
              } catch (parseErr) {
                // Si c'est notre erreur enrichie, la relancer
                if ((parseErr as any).Code) throw parseErr
              }

              const err = new Error(`AI API ${res.status}: ${text}`)
              ;(err as any).status = res.status
              throw err
            }

            return res.json()
          }, AI_RETRY_OPTIONS)
        },
      },
    }
  }

  get audio() {
    return {
      asr: {
        create: async (params: { file_base64: string }): Promise<any> => {
          throw new Error('ASR (speech-to-text) requires the Z.ai platform. Not available with external AI providers.')
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

// ─── Singleton ─────────────────────────────────────────────────────

let zaiInstance: any = null
let initAttempted = false
let initError: string | null = null

/**
 * Read config from env vars or .z-ai-config file.
 */
function readConfig(): { baseUrl: string; apiKey: string } | null {
  // 1. Environment variables
  const baseUrl = process.env.AI_BASE_URL || process.env.ZAI_BASE_URL
  const apiKey = process.env.AI_API_KEY || process.env.ZAI_API_KEY
  if (baseUrl && apiKey) return { baseUrl, apiKey }

  // 2. Config file
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
 * Get a ready-to-use AI client.
 *
 * - In dev (Z.ai config file): uses the full z-ai-web-dev-sdk
 * - On Vercel / with env vars: uses a lightweight fetch-based client
 *   compatible with Mistral, OpenAI, and any OpenAI-compatible API.
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

  // Try native SDK first (works in dev with Z.ai internal API)
  if (!process.env.AI_BASE_URL && !process.env.ZAI_BASE_URL) {
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      zaiInstance = await ZAI.create()
      return zaiInstance
    } catch (err) {
      console.warn('SDK failed, falling back to fetch client:', err)
    }
  }

  // Fetch-based client for external APIs (Mistral, OpenAI, etc.)
  zaiInstance = new FetchAI(config.baseUrl, config.apiKey)
  return zaiInstance
}

/**
 * Check if AI is configured.
 */
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
