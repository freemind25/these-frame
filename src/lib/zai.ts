import { existsSync, readFileSync } from 'fs'
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

// ─── FILE D'ATTENTE GLOBALE (FIFO) ────────────────────────────────────
// Toutes les requêtes AI passent par cette file.
// Une seule requête à la fois = jamais de dépassement du seuil de concurrence.

let queueRunning = false
const aiQueue: Array<{
  execute: () => Promise<void>
  resolve: (value: any) => void
  reject: (reason: any) => void
}> = []

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    aiQueue.push({ execute: () => fn().then(resolve).catch(reject), resolve, reject })
    drainQueue()
  })
}

async function drainQueue() {
  if (queueRunning) return
  queueRunning = true

  while (aiQueue.length > 0) {
    const item = aiQueue.shift()!
    try {
      await item.execute()
    } catch (err) {
      // L'erreur est déjà propagée via reject
    }
  }

  queueRunning = false
}

// ─── DÉTECTION D'ERREURS REESSAYABLES ─────────────────────────────────

const RETRYABLE_KEYWORDS = [
  'resourceexhausted',
  'concurrency threshold',
  'ratelimit',
  'rate_limit',
  'toomanyrequests',
  'overloaded',
  'serviceunavailable',
]

function isRetryableError(error: unknown): boolean {
  const text = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : JSON.stringify(error)
  const lower = text.toLowerCase()
  return RETRYABLE_KEYWORDS.some(kw => lower.includes(kw))
}

function getErrorSummary(error: unknown): string {
  if (error instanceof Error) return error.message.slice(0, 200)
  if (typeof error === 'string') return error.slice(0, 200)
  return JSON.stringify(error).slice(0, 200)
}

// ─── RETRY AVEC BACKOFF EXPONENTIEL ───────────────────────────────────
// 5 tentatives max, délais: ~1.5s, ~3s, ~6s, ~12s, ~15s (cap)
// Temps total max de retry: ~37s (compatible avec le timeout Vercel)

async function retryAI<T>(fn: () => Promise<T>, maxAttempts = 5): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Dernière tentative ou erreur non-retryable → on arrête
      if (attempt >= maxAttempts - 1 || !isRetryableError(error)) break

      const delay = Math.min(1500 * Math.pow(2, attempt) + Math.random() * 500, 15000)
      console.warn(
        `[AI Queue] Retry ${attempt + 1}/${maxAttempts} après ${Math.round(delay)}ms – ${getErrorSummary(error)}`
      )
      await new Promise(r => setTimeout(r, delay))
    }
  }

  throw lastError
}

// ─── FETCH-BASED CLIENT (Mistral, OpenAI-compatible) ─────────────────

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

          const rawText = await res.text()

          // Parser la réponse JSON
          let data: any
          try {
            data = JSON.parse(rawText)
          } catch {
            const err = new Error(`AI API ${res.status}: réponse JSON invalide – ${rawText.slice(0, 200)}`)
            ;(err as any).status = res.status
            throw err
          }

          // Détecter les erreurs dans le corps de la réponse (même sur HTTP 200)
          const errCode = data?.Code || data?.code || data?.error?.code
          if (!res.ok || errCode) {
            const errMsg = data?.Message || data?.message || data?.error?.message || rawText.slice(0, 200)
            const err = new Error(`AI API ${res.status} [${errCode || 'UNKNOWN'}]: ${errMsg}`)
            ;(err as any).Code = errCode
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

// ─── SINGLETON ────────────────────────────────────────────────────────

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
        const cfg = JSON.parse(readFileSync(p, 'utf-8'))
        if (cfg.baseUrl && cfg.apiKey) return { baseUrl: cfg.baseUrl, apiKey: cfg.apiKey }
      }
    } catch { /* skip */ }
  }
  return null
}

/**
 * Retourne un client AI prêt à l'emploi.
 * - En dev (fichier .z-ai-config) : utilise z-ai-web-dev-sdk
 * - Sur Vercel / avec env vars : utilise FetchAI (Mistral, OpenAI, etc.)
 *
 * Dans les deux cas, les appels sont :
 * 1. Sérialisés par une file FIFO (1 appel à la fois)
 * 2. Retentés automatiquement sur ResourceExhausted (5 max, backoff exponentiel)
 */
export async function getZAI() {
  if (zaiInstance) return zaiInstance
  if (initAttempted && initError) throw new Error(initError)

  initAttempted = true
  const config = readConfig()

  if (!config) {
    initError = 'Configuration IA non trouvée. Ajoutez AI_BASE_URL et AI_API_KEY dans les variables d\'environnement.'
    throw new Error(initError)
  }

  // Essayer le SDK natif d'abord (développement local)
  let raw: any = null
  if (!process.env.AI_BASE_URL && !process.env.ZAI_BASE_URL) {
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      raw = await ZAI.create()
    } catch (err) {
      console.warn('[ZAI] SDK indisponible, utilisation du client fetch:', err)
    }
  }
  if (!raw) raw = new FetchAI(config.baseUrl, config.apiKey)

  // Wrappé : queue FIFO + retry automatique
  const originalCreate = raw.chat.completions.create.bind(raw.chat.completions)

  zaiInstance = {
    chat: {
      completions: {
        create: (body: CreateChatCompletionBody) => {
          return enqueue(() => retryAI(() => originalCreate(body), 5))
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
        const cfg = JSON.parse(readFileSync(p, 'utf-8'))
        if (cfg.baseUrl && cfg.apiKey) return true
      }
    } catch { /* skip */ }
  }
  return false
}
