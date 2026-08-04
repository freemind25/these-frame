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

// ─── GLOBAL SEMAPHORE ──────────────────────────────────────────────────
// Limite à 1 seul appel AI à la fois sur TOUTE l'application.
// C'est la seule façon fiable de ne pas dépasser le seuil de concurrence
// du conteneur DashScope quand on ne contrôle pas le backend.

class SimpleSemaphore {
  private queue: Array<() => void> = []
  private active = 0

  constructor(private max: number) {}

  async acquire(): Promise<void> {
    if (this.active < this.max) {
      this.active++
      return
    }
    return new Promise<void>(resolve => this.queue.push(resolve))
  }

  release(): void {
    this.active--
    const next = this.queue.shift()
    if (next) {
      this.active++
      next()
    }
  }
}

// ★ Max 1 appel AI simultané dans tout le serveur ★
const globalAISemaphore = new SimpleSemaphore(1)

// ─── Retry options (délais plus longs) ────────────────────────────────

const AI_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 8,
  baseDelay: 3000,
  maxDelay: 30000,
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

// ─── Helper: normalize any error to extract code ─────────────────────

function extractErrorInfo(error: unknown): { code: string; isRetryable: boolean } {
  const retryCodes = AI_RETRY_OPTIONS.retryableCodes || []
  let raw = ''

  if (!error) return { code: '', isRetryable: false }

  // Cas 1 : l'erreur est une chaîne JSON brute
  if (typeof error === 'string') {
    raw = error
  }
  // Cas 2 : objet avec .Code (format DashScope)
  else if (typeof error === 'object') {
    const err = error as Record<string, unknown>
    if (err.Code) raw = String(err.Code)
    else if (err.code) raw = String(err.code)
    else if (err.message) raw = String(err.message)
    else raw = JSON.stringify(error)
  }
  // Cas 3 : Error standard
  else if (error instanceof Error) {
    raw = (error as any).Code || error.message || ''
  }

  // Tenter de parser si c'est du JSON
  let code = raw
  try {
    const parsed = JSON.parse(raw)
    if (parsed.Code) code = parsed.Code
    else if (parsed.code) code = parsed.code
    else if (parsed.error?.code) code = parsed.code
  } catch { /* pas du JSON, utiliser tel quel */ }

  const isRetryable = retryCodes.some(c =>
    code.toLowerCase().includes(c.toLowerCase())
  )

  return { code, isRetryable }
}

// ─── Helper: check response body for hidden errors ─────────────────────

function checkResponseForErrors(response: any): void {
  if (!response || typeof response !== 'object') return

  const code = response.Code || response.code || response.error?.code
  if (code && typeof code === 'string') {
    const { isRetryable } = extractErrorInfo({ Code: code })
    if (isRetryable) {
      const err = new Error(`AI Error [${code}]: ${response.Message || response.message || ''}`)
      ;(err as any).Code = code
      ;(err as any).status = 429
      throw err
    }
  }

  if (response.error && typeof response.error === 'object') {
    const { isRetryable } = extractErrorInfo(response.error)
    if (isRetryable) {
      const err = new Error(`AI Error: ${response.error.message || ''}`)
      ;(err as any).Code = response.error.type || response.error.code
      ;(err as any).status = 429
      throw err
    }
  }
}

// ─── Wrapper: retry + global semaphore ─────────────────────────────────

function createResilientWrapper(rawZai: any): any {
  return {
    chat: {
      completions: {
        create: async (body: CreateChatCompletionBody): Promise<any> => {
          // ★ Sémaphore global : un seul appel AI à la fois
          await globalAISemaphore.acquire()
          try {
            return await withRetry(async () => {
              try {
                const response = await rawZai.chat.completions.create(body)
                checkResponseForErrors(response)
                return response
              } catch (error: unknown) {
                const { code, isRetryable } = extractErrorInfo(error)
                console.error(`[AI] Erreur détectée: code=${code}, retryable=${isRetryable}`)
                if (isRetryable) {
                  const err = new Error(`AI [${code}]: ${(error instanceof Error ? error.message : String(error)).slice(0, 200)}`)
                  ;(err as any).Code = code
                  ;(err as any).status = 429
                  throw err
                }
                throw error
              }
            }, AI_RETRY_OPTIONS)
          } finally {
            globalAISemaphore.release()
          }
        },
      },
    },
    audio: rawZai.audio,
    functions: rawZai.functions,
    images: rawZai.images,
  }
}

// ─── FetchAI client ────────────────────────────────────────────────────

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
      asr: { create: async () => { throw new Error('ASR requires the Z.ai platform.') } },
    }
  }
  get functions() {
    return {
      invoke: async () => { throw new Error('AI functions require the Z.ai platform.') },
    }
  }
  get images() {
    return {
      generations: { create: async () => { throw new Error('Image generation requires the Z.ai platform.') } },
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

  if (!process.env.AI_BASE_URL && !process.env.ZAI_BASE_URL) {
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      rawInstance = await ZAI.create()
    } catch (err) {
      console.warn('SDK failed, falling back to fetch client:', err)
      rawInstance = null
    }
  }

  if (!rawInstance) {
    rawInstance = new FetchAI(config.baseUrl, config.apiKey)
  }

  // ★ TOUJOURS wrappé : retry + sémaphore global
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
