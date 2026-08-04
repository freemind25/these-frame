import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    patchVersion: 'v6-cross-container-retry',
    strategy: 'FIFO locale + retry 8-10s fixe (cross-container)',
    maxRetries: 5,
    retryDelay: '8-10 secondes (fixe + jitter)',
    totalRetryTime: '~40s',
    proactiveJitter: '0-500ms avant chaque appel',
    timestamp: new Date().toISOString(),
    note: 'v6: délais longs pour attendre la fin des appels concurrents depuis d\'autres containers Vercel.',
  })
}
