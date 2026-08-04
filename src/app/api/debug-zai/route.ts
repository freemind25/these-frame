import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    patchVersion: 'v4-queue',
    hasQueue: true,
    retryAttempts: 8,
    minDelayBetweenCalls: 2000,
    timestamp: new Date().toISOString(),
    note: 'Si vous voyez patchVersion=v4-queue, le patch est chargé.',
  })
}
