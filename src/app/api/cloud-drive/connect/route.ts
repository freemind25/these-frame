import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-drive'

export async function GET(req: NextRequest) {
  try {
    // Derive base URL from request headers so redirect_uri is always correct
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const host = req.headers.get('host') || 'localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '')
      : `${protocol}://${host}`

    const url = getGoogleAuthUrl('thesisframe_connect', baseUrl)
    return NextResponse.json({ url })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Configuration manquante' },
      { status: 500 },
    )
  }
}
