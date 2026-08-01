import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function POST() {
  try {
    // Run prisma db push to ensure schema is created
    const output = execSync('npx prisma db push --skip-generate --accept-data-loss 2>&1', {
      cwd: process.cwd(),
      stdio: 'pipe',
      timeout: 30000,
    })
    const msg = output.toString().trim()
    console.log('[setup] prisma db push output:', msg)
    return NextResponse.json({ success: true, message: msg || 'Database ready' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[setup] Failed:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
