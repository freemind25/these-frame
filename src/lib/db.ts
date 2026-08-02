import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient, type Client } from '@libsql/client'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

// ─── DATABASE_URL handling ─────────────────────────────────────
// Local/Preview Panel : file:./db/custom.db
// Vercel + Turso      : libsql://user.db.turso.io?authToken=xxx
// ────────────────────────────────────────────────────────────────
const isTursoUrl = (url: string) => url.startsWith('libsql://') || url.startsWith('https://')

const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db'
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl
}

// Ensure local db directory exists (only for file: URLs)
if (dbUrl.startsWith('file:')) {
  const dbFilePath = dbUrl.replace(/^file:/, '')
  const absoluteDbPath = dbFilePath.startsWith('/') ? dbFilePath : join(process.cwd(), dbFilePath)
  const dbDir = dirname(absoluteDbPath)
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }
}

export const isUsingTurso = isTursoUrl(dbUrl)

// ─── Prisma Client with libSQL adapter (works for local + Turso) ───
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClientInstance(): PrismaClient {
  const libsql: Client = createClient({ url: dbUrl })
  const adapter = new PrismaLibSql(libsql)
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createClientInstance()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// ─── ensureDb() - verify database connection ───
let _ensured = false

export async function ensureDb(): Promise<boolean> {
  if (_ensured) return true
  try {
    await db.$queryRaw`SELECT 1`
    _ensured = true
    return true
  } catch (err) {
    console.error('[ensureDb] Database connection failed:', err)
    return false
  }
}
