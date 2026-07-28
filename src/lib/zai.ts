import ZAI from 'z-ai-web-dev-sdk'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

// Singleton SDK instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null
let initAttempted = false
let initError: string | null = null

/**
 * Get a ready-to-use ZAI SDK instance.
 * The SDK auto-loads config from .z-ai-config file or environment variables.
 */
export async function getZAI() {
  if (zaiInstance) return zaiInstance

  if (initAttempted && initError) {
    throw new Error(initError)
  }

  initAttempted = true

  try {
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
