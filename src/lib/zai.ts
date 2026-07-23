import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import ZAI from 'z-ai-web-dev-sdk'

// Singleton SDK instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

interface ZAIConfig {
  baseUrl: string
  apiKey: string
  chatId?: string
  userId?: string
  token?: string
}

/**
 * Try to read .z-ai-config from file system (Z.ai platform).
 * Returns null if not found or invalid.
 */
function readFileConfig(): ZAIConfig | null {
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
  return null
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
 * Ensure a valid .z-ai-config exists in the project root (cwd).
 * This is needed when the SDK's own loadConfig() will be called (ZAI.create()).
 * Only used as a fallback when we can't use the direct constructor.
 */
function ensureZaiConfig() {
  const cwdConfig = '.z-ai-config'

  // If config already exists in cwd, skip
  if (existsSync(cwdConfig)) {
    try {
      const data = JSON.parse(readFileSync(cwdConfig, 'utf-8'))
      if (data.baseUrl && data.apiKey) return
    } catch { /* invalid, recreate */ }
  }

  // Strategy 1: Copy from /etc/.z-ai-config (Z.ai platform)
  const etcConfig = '/etc/.z-ai-config'
  if (existsSync(etcConfig)) {
    try {
      const content = readFileSync(etcConfig, 'utf-8')
      const data = JSON.parse(content)
      if (data.baseUrl && data.apiKey) {
        writeFileSync(cwdConfig, content, 'utf-8')
        return
      }
    } catch { /* read/parse/write error */ }
  }

  // Strategy 2: Build from environment variables
  const envConfig = buildConfigFromEnv()
  if (envConfig) {
    const json = JSON.stringify(envConfig)
    // Try writing to cwd, then homedir, then /tmp
    const targets = [cwdConfig, join(homedir(), '.z-ai-config'), '/tmp/.z-ai-config']
    for (const target of targets) {
      try {
        writeFileSync(target, json, 'utf-8')
        return
      } catch { /* not writable, try next */ }
    }
  }
}

/**
 * Get a ready-to-use ZAI SDK instance.
 * Handles config setup for both Z.ai platform and Vercel deployments.
 *
 * Strategy:
 * 1. Try reading existing .z-ai-config file (Z.ai platform)
 * 2. Try building from environment variables and use direct constructor
 * 3. Fallback: ensure file exists and use ZAI.create()
 */
export async function getZAI() {
  if (zaiInstance) return zaiInstance

  // Strategy 1: Read from file system
  const fileConfig = readFileConfig()
  if (fileConfig) {
    zaiInstance = new ZAI(fileConfig)
    return zaiInstance
  }

  // Strategy 2: Build from environment variables (works on read-only filesystems like Vercel)
  const envConfig = buildConfigFromEnv()
  if (envConfig) {
    zaiInstance = new ZAI(envConfig)
    return zaiInstance
  }

  // Strategy 3: Legacy fallback — ensure file and use SDK's own create()
  ensureZaiConfig()
  zaiInstance = await ZAI.create()
  return zaiInstance
}