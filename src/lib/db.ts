import { PrismaClient } from '@prisma/client'
import { mkdirSync } from 'fs'

// On Vercel, the filesystem is read-only except /tmp.
// Use /tmp for the SQLite database in production environments.
function getDatabaseUrl(): string {
  // On Vercel, always use /tmp regardless of DATABASE_URL
  if (process.env.VERCEL) {
    try { mkdirSync('/tmp', { recursive: true }) } catch {}
    return 'file:/tmp/custom.db'
  }
  // Local / other environments
  return process.env.DATABASE_URL || 'file:./db/custom.db'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbInitialized: boolean | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
  })

globalForPrisma.prisma = db

// Ensure database tables exist (needed on Vercel where prisma db push can't run)
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Post" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT 0,
  "authorId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "MendeleyConfig" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clientId" TEXT,
  "clientSecret" TEXT,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "tokenExpiresAt" DATETIME,
  "connected" BOOLEAN NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Reference" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" TEXT NOT NULL DEFAULT 'article',
  "citationKey" TEXT,
  "title" TEXT NOT NULL,
  "authors" TEXT NOT NULL,
  "year" TEXT,
  "journal" TEXT,
  "volume" TEXT,
  "number" TEXT,
  "pages" TEXT,
  "doi" TEXT,
  "abstract" TEXT,
  "tags" TEXT,
  "notes" TEXT,
  "source" TEXT NOT NULL DEFAULT 'manual',
  "mendeleyId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Reference_mendeleyId_key" ON "Reference"("mendeleyId");

CREATE TABLE IF NOT EXISTS "Thesis" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT 'Ma thèse de doctorat',
  "subtitle" TEXT,
  "author" TEXT NOT NULL DEFAULT 'Doctorant',
  "field" TEXT NOT NULL DEFAULT '',
  "university" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Chapter" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "thesisId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "number" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL DEFAULT '',
  "wordCount" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "directorFeedback" TEXT DEFAULT '',
  "directorFeedbackAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Chapter_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "Thesis"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Chapter_thesisId_order_key" ON "Chapter"("thesisId", "order");
`

export async function ensureDb() {
  if (globalForPrisma.dbInitialized) return
   try {
    // Test if tables exist by running a simple query
    await db.$queryRaw`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Thesis'`
    globalForPrisma.dbInitialized = true
  } catch {
    // Tables don't exist yet, create them
    for (const stmt of CREATE_TABLES_SQL.split(';').map(s => s.trim()).filter(s => s.length > 0)) {
      await db.$executeRawUnsafe(stmt)
    }
    globalForPrisma.dbInitialized = true
  }
}
