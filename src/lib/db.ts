import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

// ─── Ensure DATABASE_URL is set and DB file exists ───
const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db'
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('file:')) {
  process.env.DATABASE_URL = dbUrl
}

// Extract file path from file: URL
const dbFilePath = dbUrl.replace(/^file:/, '')
const absoluteDbPath = dbFilePath.startsWith('/') ? dbFilePath : join(process.cwd(), dbFilePath)
const dbDir = dirname(absoluteDbPath)

// Create db directory if it doesn't exist
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

// Auto-push schema if DB file doesn't exist (e.g. fresh Preview Panel)
if (!existsSync(absoluteDbPath)) {
  try {
    console.log('[db] Database file not found, running prisma db push...')
    execSync('npx prisma db push --skip-generate --accept-data-loss 2>&1', {
      cwd: process.cwd(),
      stdio: 'pipe',
      timeout: 30000,
    })
    console.log('[db] Schema pushed successfully.')
  } catch (err) {
    console.error('[db] Auto prisma db push failed:', err)
  }
}

// ─── Prisma Client (SQLite) ───
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// ─── ensureDb() ─────────────────────────────────────────
let _ensured = false

export async function ensureDb() {
  if (_ensured) return
  try {
    await db.$queryRaw`SELECT 1`
    _ensured = true
  } catch (err) {
    console.error('[ensureDb] Database connection check failed:', err)
  }
}
