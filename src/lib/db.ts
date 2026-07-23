import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['error'] : [],
  })

// Always cache to avoid multiple instances (important for Supabase pooler)
globalForPrisma.prisma = db

// Re-export for backward compat
export async function ensureDb() {
  // No-op: Supabase handles table creation
}
