import { PrismaClient } from '@prisma/client'

// ─── Prisma Client (Postgres — persistant, y compris sur Vercel) ───
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// ─── ensureDb() ─────────────────────────────────────────
// Historiquement utilisé pour bootstrapper le schéma SQLite au cold start
// (base de données éphémère sur Vercel). Avec Postgres (Supabase), les
// tables sont créées une fois via migration et persistent normalement —
// cette fonction ne fait donc plus qu'une vérification de connexion,
// conservée pour ne pas casser les appels existants dans les routes API.
let _ensured = false

export async function ensureDb() {
  if (_ensured) return
  try {
    await db.$queryRaw`SELECT 1`
    _ensured = true
  } catch (err) {
    console.error('[ensureDb] Database connection check failed:', err)
  }
}
