import { PrismaClient } from '@prisma/client'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@libsql/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

// ─── DATABASE_URL resolution ────────────────────────────
try {
  const envPath = resolve(process.cwd(), '.env')
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8')
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim()
      if (trimmed.startsWith('DATABASE_URL=')) {
        const val = trimmed.slice('DATABASE_URL='.length)
        if (val && !val.startsWith('postgresql')) {
          process.env.DATABASE_URL = val
        }
      }
    }
  }
} catch {}

// ─── SQL for auto-creating tables ──────────────────────
const TABLE_SQL = [
  `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY,"email" TEXT NOT NULL,"name" TEXT,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE TABLE IF NOT EXISTS "Post" ("id" TEXT NOT NULL PRIMARY KEY,"title" TEXT NOT NULL,"content" TEXT,"published" BOOLEAN NOT NULL DEFAULT 0,"authorId" TEXT NOT NULL,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "MendeleyConfig" ("id" TEXT NOT NULL PRIMARY KEY,"clientId" TEXT,"clientSecret" TEXT,"accessToken" TEXT,"refreshToken" TEXT,"tokenExpiresAt" DATETIME,"connected" BOOLEAN NOT NULL DEFAULT 0,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Reference" ("id" TEXT NOT NULL PRIMARY KEY,"type" TEXT NOT NULL DEFAULT 'article',"citationKey" TEXT,"title" TEXT NOT NULL,"authors" TEXT NOT NULL,"year" TEXT,"journal" TEXT,"volume" TEXT,"number" TEXT,"pages" TEXT,"doi" TEXT,"abstract" TEXT,"tags" TEXT,"notes" TEXT,"source" TEXT NOT NULL DEFAULT 'manual',"mendeleyId" TEXT,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Reference_mendeleyId_key" ON "Reference"("mendeleyId")`,
  `CREATE TABLE IF NOT EXISTS "Thesis" ("id" TEXT NOT NULL PRIMARY KEY,"title" TEXT NOT NULL DEFAULT 'Ma thèse de doctorat',"subtitle" TEXT,"author" TEXT NOT NULL DEFAULT 'Doctorant',"field" TEXT NOT NULL DEFAULT '',"university" TEXT NOT NULL DEFAULT '',"status" TEXT NOT NULL DEFAULT 'draft',"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Chapter" ("id" TEXT NOT NULL PRIMARY KEY,"thesisId" TEXT NOT NULL,"order" INTEGER NOT NULL,"number" TEXT NOT NULL,"title" TEXT NOT NULL,"content" TEXT NOT NULL DEFAULT '',"wordCount" INTEGER NOT NULL DEFAULT 0,"status" TEXT NOT NULL DEFAULT 'draft',"directorFeedback" TEXT,"directorFeedbackAt" DATETIME,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Chapter_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "Thesis"("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Chapter_thesisId_order_key" ON "Chapter"("thesisId","order")`,
  `CREATE TABLE IF NOT EXISTS "CloudDriveConnection" ("id" TEXT NOT NULL PRIMARY KEY,"provider" TEXT NOT NULL DEFAULT 'google_drive',"connected" BOOLEAN NOT NULL DEFAULT 0,"email" TEXT,"displayName" TEXT,"accessToken" TEXT,"refreshToken" TEXT,"tokenExpiresAt" DATETIME,"lastSyncAt" DATETIME,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
]

let _ensured = false
let _db: PrismaClient | undefined

function getDbPath(): string {
  return process.env.VERCEL ? '/tmp/thesis.db' : './db/custom.db'
}

function createPrismaClient(): PrismaClient {
  const dbPath = getDbPath()
  const dbDir = resolve(dbPath, '..')
  mkdirSync(dbDir, { recursive: true })

  const libsql = createClient({
    url: `file:${resolve(dbPath)}`,
  })

  return new PrismaClient({
    adapter: new PrismaLibSql(libsql),
  })
}

export function getDb(): PrismaClient {
  if (!_db) {
    const g = globalThis as unknown as { prisma: PrismaClient | undefined }
    if (!g.prisma) {
      g.prisma = createPrismaClient()
    }
    _db = g.prisma
  }
  return _db
}

/** Legacy export – calls getDb() lazily */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getDb() as any)[prop]
  },
})

export async function ensureDb() {
  if (_ensured) return

  const client = getDb()

  try {
    // Check that the Thesis table actually exists (not just that SQLite is reachable)
    const rows = await client.$queryRawUnsafe<{name: string}[]>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Thesis'"
    )
    if (rows.length > 0) {
      _ensured = true
      return
    }
  } catch {
    // Table doesn't exist yet, fall through to create
  }

  for (const sql of TABLE_SQL) {
    try {
      await client.$executeRawUnsafe(sql)
    } catch (err) {
      console.error('[ensureDb]', sql.slice(0, 50), err)
    }
  }

  _ensured = true
}
