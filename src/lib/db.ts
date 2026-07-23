import { PrismaClient } from '@prisma/client'

// On Vercel, the filesystem is read-only except /tmp.
// Use /tmp for the SQLite database in production/edge environments.
function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL
  if (!envUrl) {
    throw new Error('DATABASE_URL is not set')
  }
  // If it's a file: path and we're on Vercel (VERCEL env var), redirect to /tmp
  if (envUrl.startsWith('file:') && process.env.VERCEL) {
    return 'file:/tmp/custom.db'
  }
  return envUrl
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
