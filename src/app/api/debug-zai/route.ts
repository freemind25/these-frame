import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    patchVersion: 'v5-clean-queue',
    hasQueue: true,
    maxRetries: 5,
    retryDelays: ['~1.5s', '~3s', '~6s', '~12s', '~15s'],
    maxTotalRetryTime: '~37s',
    serialization: 'FIFO (1 appel AI à la fois)',
    timestamp: new Date().toISOString(),
    note: 'Si vous voyez patchVersion=v5-clean-queue, le patch v5 est chargé.',
  })
}
