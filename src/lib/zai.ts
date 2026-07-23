import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import ZAI from 'z-ai-web-dev-sdk'

// Singleton SDK instance
let zaiInstance: InstanceType<typeof ZAI> | null = null
let initAttempted = false
let initError: string | null = null

interface ZAIConfig {
  baseUrl: string
  apiKey: string
  chatId?: string
  userId?: string
  token?: string
}

/**
 * Build config from environment variables (Vercel, Netlify, etc.).
 * Returns null if required vars are missing.
 */
function buildConfigFromEnv(): ZAIConfig | null {
  const baseUrl = process.env.ZAI_BASE_URL
  const apiKey = process.env.ZAI_API_KEY
  if (!baseUrl || !apiKey) return null

  const config: ZAIConfig = { baseUrl, apiKey }
  if (process.env.ZAI_CHAT_ID) config.chatId = process.env.ZAI_CHAT_ID
  if (process.env.ZAI_USER_ID) config.userId = process.env.ZAI_USER_ID
  if (process.env.ZAI_TOKEN) config.token = process.env.ZAI_TOKEN
  return config
}

/**
 * Safely read .z-ai-config from file system (Z.ai platform only).
 * Returns null on any error (including read-only filesystem on Vercel).
 */
function readFileConfig(): ZAIConfig | null {
  try {
    const paths = [
      '.z-ai-config',
      join(homedir(), '.z-ai-config'),
      '/etc/.z-ai-config',
    ]

    for (const p of paths) {
      try {
        if (!existsSync(p)) continue
        const data = JSON.parse(readFileSync(p, 'utf-8'))
        if (data.baseUrl && data.apiKey) return data as ZAIConfig
      } catch { /* skip */ }
    }
  } catch {
    // File system not available (e.g., Vercel read-only) — continue to env vars
  }
  return null
}

/**
 * Get a ready-to-use ZAI SDK instance.
 *
 * Strategy (Vercel-safe):
 * 1. Try reading existing .z-ai-config file (Z.ai platform)
 * 2. Try building from environment variables
 * 3. If both fail, store error — never throw silently, never write files
 */
export async function getZAI() {
  if (zaiInstance) return zaiInstance

  // Prevent repeated failed initialization attempts
  if (initAttempted && initError) {
    throw new Error(initError)
  }

  initAttempted = true

  // Strategy 1: Read from file system (works on Z.ai platform)
  const fileConfig = readFileConfig()
  if (fileConfig) {
    try {
      zaiInstance = new ZAI(fileConfig)
      return zaiInstance
    } catch (err) {
      console.error('Failed to initialize ZAI from file config:', err)
    }
  }

  // Strategy 2: Build from environment variables (Vercel, Netlify, etc.)
  const envConfig = buildConfigFromEnv()
  if (envConfig) {
    try {
      zaiInstance = new ZAI(envConfig)
      return zaiInstance
    } catch (err) {
      console.error('Failed to initialize ZAI from env config:', err)
    }
  }

  // No config available — store a clear error message
  initError =
    'Configuration IA non trouvée. ' +
    'Sur Vercel, ajoutez les variables d\'environnement : ZAI_BASE_URL, ZAI_API_KEY, ZAI_CHAT_ID, ZAI_TOKEN, ZAI_USER_ID. ' +
    'En local, le fichier .z-ai-config est utilisé automatiquement.'

  throw new Error(initError)
}

/**
 * Check if ZAI is configured (for UI status display).
 */
export function isZAIConfigured(): boolean {
  const envConfig = buildConfigFromEnv()
  if (envConfig) return true

  try {
    const fileConfig = readFileConfig()
    if (fileConfig) return true
  } catch { /* ignore */ }

  return false
}
