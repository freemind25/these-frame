import ZAI from 'z-ai-web-dev-sdk'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { homedir, tmpdir } from 'os'

// Singleton SDK instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null
let initAttempted = false
let initError: string | null = null

/**
 * Ensure a .z-ai-config file exists for the SDK to read.
 * On Vercel / serverless, the SDK can't find the file by default,
 * so we write it from env vars to /tmp (writable on Vercel).
 */
function ensureConfigFile(): void {
  // Check all standard paths first
  const stdPaths = [
    '.z-ai-config',
    join(homedir(), '.z-ai-config'),
    '/etc/.z-ai-config',
  ]
  for (const p of stdPaths) {
    if (existsSync(p)) {
      try {
        const data = JSON.parse(readFileSync(p, 'utf-8'))
        if (data.baseUrl && data.apiKey) return // config found, no-op
      } catch { /* corrupted, try env vars */ }
    }
  }

  // No valid config file found — build one from env vars
  const baseUrl = process.env.ZAI_BASE_URL
  const apiKey = process.env.ZAI_API_KEY

  if (!baseUrl || !apiKey) return // nothing to write

  // Write to /tmp so the SDK can find it via HOME override or direct read
  const tmpConfigPath = join(tmpdir(), '.z-ai-config')
  try {
    writeFileSync(tmpConfigPath, JSON.stringify({ baseUrl, apiKey }), 'utf-8')
    // Override HOME so the SDK's ~/ check resolves to /tmp
    process.env.HOME = tmpdir()
    process.env.USERPROFILE = tmpdir()
  } catch {
    // /tmp not writable (very rare), try current directory
    try {
      writeFileSync('.z-ai-config', JSON.stringify({ baseUrl, apiKey }), 'utf-8')
    } catch { /* give up */ }
  }
}

/**
 * Get a ready-to-use ZAI SDK instance.
 * Auto-creates .z-ai-config from env vars on Vercel.
 */
export async function getZAI() {
  if (zaiInstance) return zaiInstance

  if (initAttempted && initError) {
    throw new Error(initError)
  }

  initAttempted = true

  try {
    ensureConfigFile()
    zaiInstance = await ZAI.create()
    return zaiInstance
  } catch (err) {
    initError =
      'Configuration IA non trouvée. ' +
      'Sur Vercel, ajoutez les variables d\'environnement : ZAI_BASE_URL, ZAI_API_KEY.'
    console.error('Failed to initialize ZAI:', err)
    throw new Error(initError)
  }
}

/**
 * Check if ZAI is likely configured (for UI status display).
 */
export function isZAIConfigured(): boolean {
  // Check environment variables
  if (process.env.ZAI_BASE_URL && process.env.ZAI_API_KEY) return true

  // Check file system
  try {
    const paths = [
      '.z-ai-config',
      join(homedir(), '.z-ai-config'),
      '/etc/.z-ai-config',
      join(tmpdir(), '.z-ai-config'),
    ]
    for (const p of paths) {
      if (existsSync(p)) {
        const data = JSON.parse(readFileSync(p, 'utf-8'))
        if (data.baseUrl && data.apiKey) return true
      }
    }
  } catch { /* ignore */ }

  return false
}
