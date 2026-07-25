import { PrismaClient } from '@prisma/client'
import { existsSync, mkdirSync, readFileSync } from 'fs'

// ─── Database URL (Turbopack-safe: string literals, not process.env) ───
// Turbopack inlines process.env.DATABASE_URL at build time → undefined on Vercel.
// Instead, pass the URL directly via datasources to bypass Prisma's env() lookup.
const IS_SERVERLESS = typeof process.env.VERCEL !== 'undefined'
const DB_URL = IS_SERVERLESS ? 'file:/tmp/thesis.db' : 'file:./db/custom.db'

// Ensure DB directory exists (local dev only — /tmp always exists on Vercel)
if (!IS_SERVERLESS) {
  mkdirSync('./db', { recursive: true })
}

// ─── Prisma Client (native SQLite engine) ─────────────
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    datasources: {
      db: { url: DB_URL },
    },
  })
}

export const db = globalForPrisma.prisma

// ─── SQL for auto-creating tables (serverless / fresh DB) ───
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

export async function ensureDb() {
  if (_ensured) return
  try {
    const rows = await db.$queryRawUnsafe<{ name: string }[]>(
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
}
