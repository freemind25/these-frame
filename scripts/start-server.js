/**
 * ThesisFrame — Embedded server launcher for Tauri
 * This script is bundled inside the Tauri app and starts the Next.js standalone server.
 */
const path = require('path');
const fs = require('fs');

// Ensure DB directory exists
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Set environment for production
process.env.NODE_ENV = 'production';
process.env.PORT = String(process.env.PORT || '3100');
process.env.HOSTNAME = '127.0.0.1';
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:' + path.join(dbDir, 'custom.db');
}

console.log(`[ThesisFrame] Starting server on port ${process.env.PORT}...`);
console.log(`[ThesisFrame] DB: ${process.env.DATABASE_URL}`);

// Initialize SQLite tables (Prisma doesn't auto-create in standalone)
async function initDb() {
  try {
    const { PrismaClient } = require('./node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client')
      || require('./node_modules/@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "name" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Post" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "content" TEXT, "published" BOOLEAN NOT NULL DEFAULT 0, "authorId" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "MendeleyConfig" ("id" TEXT NOT NULL PRIMARY KEY, "clientId" TEXT, "clientSecret" TEXT, "accessToken" TEXT, "refreshToken" TEXT, "tokenExpiresAt" DATETIME, "connected" BOOLEAN NOT NULL DEFAULT 0, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Reference" ("id" TEXT NOT NULL PRIMARY KEY, "type" TEXT NOT NULL DEFAULT 'article', "citationKey" TEXT, "title" TEXT NOT NULL, "authors" TEXT NOT NULL, "year" TEXT, "journal" TEXT, "volume" TEXT, "number" TEXT, "pages" TEXT, "doi" TEXT, "abstract" TEXT, "tags" TEXT, "notes" TEXT, "source" TEXT NOT NULL DEFAULT 'manual', "mendeleyId" TEXT UNIQUE, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Thesis" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL DEFAULT 'Ma thèse de doctorat', "subtitle" TEXT, "author" TEXT NOT NULL DEFAULT 'Doctorant', "field" TEXT NOT NULL DEFAULT '', "university" TEXT NOT NULL DEFAULT '', "status" TEXT NOT NULL DEFAULT 'draft', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Chapter" ("id" TEXT NOT NULL PRIMARY KEY, "thesisId" TEXT NOT NULL, "order" INTEGER NOT NULL, "number" TEXT NOT NULL, "title" TEXT NOT NULL, "content" TEXT NOT NULL DEFAULT '', "wordCount" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'draft', "directorFeedback" TEXT, "directorFeedbackAt" DATETIME, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Chapter_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "Thesis" ("id") ON DELETE CASCADE ON UPDATE CASCADE);`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "CloudDriveConnection" ("id" TEXT NOT NULL PRIMARY KEY, "provider" TEXT NOT NULL DEFAULT 'google_drive', "connected" BOOLEAN NOT NULL DEFAULT 0, "email" TEXT, "displayName" TEXT, "accessToken" TEXT, "refreshToken" TEXT, "tokenExpiresAt" DATETIME, "lastSyncAt" DATETIME, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
    await prisma.$disconnect();
    console.log('[ThesisFrame] DB tables initialized');
  } catch (e) {
    console.warn('[ThesisFrame] DB init skipped:', e.message);
  }
}

initDb().then(() => {
  require('./server.js');
}).catch(e => {
  console.error('[ThesisFrame] Fatal:', e);
  process.exit(1);
});
