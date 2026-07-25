import { NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'

export async function GET() {
  const results: Record<string, string> = {}

  // Test 1: Prisma raw query
  try {
    await ensureDb()
    const rows = await db.$queryRawUnsafe<{name: string}[]>(
      "SELECT name FROM sqlite_master WHERE type='table'"
    )
    results['prisma_tables'] = `OK (${rows.map(r => r.name).join(', ')})`
  } catch (e) {
    results['prisma_tables'] = `FAILED: ${e instanceof Error ? e.message + ' | ' + e.stack : String(e)}`
  }

  // Test 2: Prisma thesis.findFirst
  try {
    await ensureDb()
    const thesis = await db.thesis.findFirst()
    results['prisma_thesis'] = thesis ? `OK (id=${thesis.id})` : 'OK (no thesis yet)'
  } catch (e) {
    results['prisma_thesis'] = `FAILED: ${e instanceof Error ? e.message + ' | ' + e.stack : String(e)}`
  }

  // Test 3: System info
  results['platform'] = process.platform
  results['vercel'] = String(!!process.env.VERCEL)
  results['node_version'] = process.version
  results['database_url'] = (process.env.DATABASE_URL || 'not set').replace(/\/.*$/, '/***')
  results['cwd'] = process.cwd()

  return NextResponse.json(results)
}
