// ─── DATABASE_URL handling ─────────────────────────────────────
// Local/Preview Panel : file:./db/custom.db
// Vercel + Turso      : libsql://user.db.turso.io?authToken=xxx
// ────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const isTursoUrl = (url: string) => url.startsWith('libsql://') || url.startsWith('https://')

function getDbUrl(): string {
  const envUrl = process.env.DATABASE_URL
  if (envUrl && envUrl !== 'undefined' && envUrl !== '') {
    return envUrl
  }
  return 'file:./db/custom.db'
}

const dbUrl = getDbUrl()

// Ensure DATABASE_URL is set for Prisma's internal validation
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'undefined') {
  process.env.DATABASE_URL = dbUrl
}

// Ensure local db directory exists (only for file: URLs, local dev only)
if (dbUrl.startsWith('file:')) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { existsSync, mkdirSync } = require('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { join, dirname } = require('path')
    const dbFilePath = dbUrl.replace(/^file:/, '')
    const absoluteDbPath = dbFilePath.startsWith('/') ? dbFilePath : join(process.cwd(), dbFilePath)
    const dbDir = dirname(absoluteDbPath)
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }
  } catch {
    // fs not available on serverless — file: URLs shouldn't be used there
  }
}

export const isUsingTurso = isTursoUrl(dbUrl)

// ─── Prisma Client with libSQL adapter ──────────────────────────
// CRITICAL: @prisma/adapter-libsql@7.x expects a CONFIG OBJECT ({ url }),
// NOT a libsql Client instance. Passing a Client causes URL_INVALID
// because the factory's createClient() reads .url from the object.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaLibSql({ url: dbUrl })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// ─── ensureDb() - verify database connection ───
let _ensured = false

export async function ensureDb(): Promise<boolean> {
  if (_ensured) return true
  try {
    await db.$queryRaw/* sql */ `SELECT 1 as ok`
    _ensured = true
    return true
  } catch (err) {
    console.error('[ensureDb] Database connection failed:', err)
    return false
  }
}
