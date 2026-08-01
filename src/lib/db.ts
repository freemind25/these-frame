import { PrismaClient } from '@prisma/client'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

// ─── Fallback DATABASE_URL if not set (e.g. Preview Panel without .env) ───
const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db'
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('file:')) {
  process.env.DATABASE_URL = dbUrl
}

// Ensure db directory exists
const dbFilePath = dbUrl.replace(/^file:/, '')
const absoluteDbPath = dbFilePath.startsWith('/') ? dbFilePath : join(process.cwd(), dbFilePath)
const dbDir = dirname(absoluteDbPath)
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

// ─── Prisma Client (SQLite) ───
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// ─── ensureDb() - auto-creates tables via raw SQL if needed ───
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
