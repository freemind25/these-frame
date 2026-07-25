import { PrismaClient } from '@prisma/client'
import { readFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

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

const IS_SERVERLESS = !!process.env.VERCEL
const SQLITE_PATH = IS_SERVERLESS ? '/tmp/thesis.db' : './db/custom.db'

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('file:')) {
  process.env.DATABASE_URL = `file:${SQLITE_PATH}`
}

// Ensure DB directory exists
const dbDir = resolve(SQLITE_PATH, '..')
mkdirSync(dbDir, { recursive: true })

// ─── Prisma Client with libSQL adapter ────────────────
// libSQL works everywhere: local dev, Vercel serverless, Tauri desktop
// It handles file: URLs natively without needing a separate engine binary.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const libsql = createClient({
  url: `file:${resolve(SQLITE_PATH)}`,
})

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaLibSQL(libsql),
  })

globalForPrisma.prisma = db

// ─── SQL for auto-creating tables ──────────────────────
const TABLE_SQL = [
  `CREATE TABLE IF NOT EXISTS \"User\" (\"id\" TEXT NOT NULL PRIMARY KEY,\"email\" TEXT NOT NULL,\"name\" TEXT,\"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\"updatedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS \"User_email_key\" ON \"User\"(\"email\")`,
  `CREATE TABLE IF NOT EXISTS \"Post\" (\"id\" TEXT NOT NULL PRIMARY KEY,\"title\" TEXT NOT NULL,\"content\" TEXT,\"published\" BOOLEAN NOT NULL DEFAULT 0,\"authorId\" TEXT NOT NULL,\"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\"updatedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS \"MendeleyConfig\" (\"id\" TEXT NOT NULL PRIMARY KEY,\"clientId\" TEXT,\"clientSecret\" TEXT,\"accessToken\" TEXT,\"refreshToken\" TEXT,\"tokenExpiresAt\" DATETIME,\"connected\" BOOLEAN NOT NULL DEFAULT 0,\"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\"updatedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS \"Reference\" (\"id\" TEXT NOT NULL PRIMARY KEY,\"type\" TEXT NOT NULL DEFAULT 'article',\"citationKey\" TEXT,\"title\" TEXT NOT NULL,\"authors\" TEXT NOT NULL,\"year\" TEXT,\"journal\" TEXT,\"volume\" TEXT,\"number\" TEXT,\"pages\" TEXT,\"doi\" TEXT,\"abstract\" TEXT,\"tags\" TEXT,\"notes\" TEXT,\"source\" TEXT NOT NULL DEFAULT 'manual',\"mendeleyId\" TEXT,\"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\"updatedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS \"Reference_mendeleyId_key\" ON \"Reference\"(\"mendeleyId\")`,
  `CREATE TABLE IF NOT EXISTS \"Thesis\" (\"id\" TEXT NOT NULL PRIMARY KEY,\"title\" TEXT NOT NULL DEFAULT 'Ma thèse de doctorat',\"subtitle\" TEXT,\"author\" TEXT NOT NULL DEFAULT 'Doctorant',\"field\" TEXT NOT NULL DEFAULT '',\"university\" TEXT NOT NULL DEFAULT '',\"status\" TEXT NOT NULL DEFAULT 'draft',\"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\"updatedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS \"Chapter\" (\"id\" TEXT NOT NULL PRIMARY KEY,\"thesisId\" TEXT NOT NULL,\"order\" INTEGER NOT NULL,\"number\" TEXT NOT NULL,\"title\" TEXT NOT NULL,\"content\" TEXT NOT NULL DEFAULT '',\"wordCount\" INTEGER NOT NULL DEFAULT 0,\"status\" TEXT NOT NULL DEFAULT 'draft',\"directorFeedback\" TEXT,\"directorFeedbackAt\" DATETIME,\"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\"updatedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT \"Chapter_thesisId_fkey\" FOREIGN KEY (\"thesisId\") REFERENCES \"Thesis\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS \"Chapter_thesisId_order_key\" ON \"Chapter\"(\"thesisId\",\"order\")`,
  `CREATE TABLE IF NOT EXISTS \"CloudDriveConnection\" (\"id\" TEXT NOT NULL PRIMARY KEY,\"provider\" TEXT NOT NULL DEFAULT 'google_drive',\"connected\" BOOLEAN NOT NULL DEFAULT 0,\"email\" TEXT,\"displayName\" TEXT,\"accessToken\" TEXT,\"refreshToken\" TEXT,\"tokenExpiresAt\" DATETIME,\"lastSyncAt\" DATETIME,\"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\"updatedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
]

let _ensured = false

export async function ensureDb() {
  if (_ensured) return
  try {
    // Check that the Thesis table actually exists (not just that SQLite is reachable)
    const rows = await db.$queryRawUnsafe<{name: string}[]>(
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
      await db.$executeRawUnsafe(sql)
    } catch (err) {
      console.error('[ensureDb]', sql.slice(0, 50), err)
    }
  }

  _ensured = true
}</arg_value><arg_key>old_str': 
