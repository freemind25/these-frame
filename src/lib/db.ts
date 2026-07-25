import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Force-load DATABASE_URL from .env file to override any system env
try {
  const envPath = resolve(process.cwd(), '.env')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('DATABASE_URL=')) {
      const val = trimmed.slice('DATABASE_URL='.length)
      if (val.startsWith('postgresql://') || val.startsWith('postgres://')) {
        process.env.DATABASE_URL = val
      }
    }
  }
} catch {
  // .env not found, use default env
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
  // No-op: Supabase handles table creation
}
