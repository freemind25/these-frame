import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir, tmpdir } from 'os'

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

// ─── QUEUE GLOBALE ──────────────────────────────────────────────────────
// Toutes les requêtes AI passent par cette file d'attente.
// Une seule requête à la fois, avec un délai minimum entre chaque.

let queueRunning = false
const queue: Array<{ resolve: () => void; fn: () => Promise<any> }> = []

async function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    queue.push({
      resolve: () => fn().then(resolve).catch(reject),
      fn,
    })
    processQueue()
  })
}

async function processQueue() {
  if (queueRunning || queue.length === 0) return
  queueRunning = true

  while (queue.length > 0) {
    const item = queue.shift()!
    try {
      await item.resolve()
    } catch (e) {
      // L'erreur est déjà propagée via reject
    }
    // Délai obligatoire entre chaque appel pour laisser le conteneur respirer
    if (queue.length > 0) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  queueRunning = false
}

// ─── RETRY SIMPLE ET ROBUSTE ───────────────────────────────────────────

const RETRYABLE_PATTERNS = [
  'resourceexhausted',
  'concurrency threshold',
  'ratelimit',
  'rate_limit',
  'toomanyrequests',
  'overloaded',
  'serviceunavailable',
]

function isResourceError(error: unknown): boolean {
  let text = ''
  if (typeof error === 'string') text = error
  else if (error instanceof Error) text = error.message || ''
  else text = JSON.stringify(error)
  const lower = text.toLowerCase()
  return RETRYABLE_PATTERNS.some(p => lower.includes(p))
}

function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    try {
      const parsed = JSON.parse(error)
      return parsed.Message || parsed.message || error
    } catch {
      return error
    }
  }
  if (error instanceof Error) return error.message
  return String(error)
}

/**
 * Appelle fn avec retry. Simple, sans dépendance externe.
 */
async function retryAI<T>(fn: () => Promise<T>, maxAttempts = 8): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt >= maxAttempts - 1) break
      if (!isResourceError(error)) break

      const delay = Math.min(3000 * Math.pow(2, attempt) + Math.random() * 1000, 30000)
      console.warn(
        `[AI Retry] ${attempt + 1}/${maxAttempts} échoué. ` +
        `Nouvel essai dans ${Math.round(delay)}ms. ` +
        `Erreur: ${extractErrorMessage(error).slice(0, 100)}
      `)
      await new Promise(r => setTimeout(r, delay))
    }
  }

  throw lastError
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
            body: JSON.stringify({ model: payload.model || 'mistral-large-latest', ...payload }),
          })
          const text = await res.text()
          const data = JSON.parse(text)
          if (!res.ok || data.Code || data.code) {
            const err = new Error(`AI API ${res.status}: ${text.slice(0, 300)}`)
            ;(err as any).Code = data?.Code || data?.code
            ;(err as any).status = res.status
            throw err
          }
          return data
        },
      },
    }
  }
  get audio() {
    return { asr: { create: async () => { throw new Error('ASR requires Z.ai platform.') } } }
  }
  get functions() {
    return { invoke: async () => { throw new Error('Functions require Z.ai platform.') } }
  }
  get images() {
    return { generations: { create: async () => { throw new Error('Image gen requires Z.ai platform.') } } }
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
  const paths = ['.z-ai-config', join(homedir(), '.z-ai-config'), '/etc/.z-ai-config', join(tmpdir(), '.z-ai-config')]
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
  if (initAttempted && initError) throw new Error(initError)

  initAttempted = true
  const config = readConfig()
  if (!config) {
    initError = 'Configuration IA non trouvée.'
    throw new Error(initError)
  }

  let raw: any = null
  if (!process.env.AI_BASE_URL && !process.env.ZAI_BASE_URL) {
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      raw = await ZAI.create()
    } catch (err) {
      console.warn('SDK failed, using fetch client:', err)
    }
  }
  if (!raw) raw = new FetchAI(config.baseUrl, config.apiKey)

  // ★ Wrappé : queue globale + retry + détection erreur dans la réponse
  const originalCreate = raw.chat.completions.create.bind(raw.chat.completions)
  zaiInstance = {
    chat: {
      completions: {
        create: async (body: CreateChatCompletionBody) => {
          return enqueue(async () => {
            return retryAI(async () => {
              const response = await originalCreate(body)

              // Vérifier si la réponse contient une erreur (même sur 200)
              const respData = response?.data || response
              const errCode = respData?.Code || respData?.code
              if (errCode && typeof errCode === 'string') {
                const lower = errCode.toLowerCase()
                if (RETRYABLE_PATTERNS.some(p => lower.includes(p))) {
                  const err = new Error(`AI Error [${errCode}]: ${respData?.Message || respData?.message || ''}`)
                  ;(err as any).Code = errCode
                  throw err
                }
              }

              // Si le SDK wrappe dans {code, data}, déballer
              if (response?.data?.choices) return response.data
              return response
            }, 8)
          })
        },
      },
    },
    audio: raw.audio,
    functions: raw.functions,
    images: raw.images,
  }

  return zaiInstance
}

export function isZAIConfigured(): boolean {
  if (process.env.AI_BASE_URL && process.env.AI_API_KEY) return true
  if (process.env.ZAI_BASE_URL && process.env.ZAI_API_KEY) return true
  const paths = ['.z-ai-config', join(homedir(), '.z-ai-config'), '/etc/.z-ai-config', join(tmpdir(), '.z-ai-config')]
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
