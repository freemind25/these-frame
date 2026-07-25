import { PrismaClient } from '@prisma/client'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// In desktop/Tauri mode, DATABASE_URL is set by the Rust launcher.
// In web/dev mode, load from .env if present.
try {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
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
  }
} catch {
  // .env not found, use default env
}

// Ensure db directory exists for SQLite
if (process.env.DATABASE_URL?.startsWith('file:')) {
  const dbPath = process.env.DATABASE_URL.replace('file:', '')
  const dbDir = resolve(dbPath, '..')
  try {
    const { mkdirSync } = require('fs')
    mkdirSync(dbDir, { recursive: true })
  } catch {}
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['error'] : [],
  })

globalForPrisma.prisma = db

export async function ensureDb() {
  // SQLite tables are created by Prisma push/migrate in dev,
  // and by start-server.js CREATE TABLE IF NOT EXISTS in desktop builds.
  try {
    await db.$queryRaw`SELECT 1`
  } catch {
    // DB not accessible yet — will retry on next request
  }
}
