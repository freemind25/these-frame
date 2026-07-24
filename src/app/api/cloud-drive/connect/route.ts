import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-drive'

export async function GET(req: NextRequest) {
  try {
    // Derive base URL from request headers so redirect_uri is always correct
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const host = req.headers.get('host') || 'localhost:3000'
    const envUrl = process.env.NEXT_PUBLIC_APP_URL
    const baseUrl = envUrl ? envUrl.replace(/\/+$/, '') : `${protocol}://${host}`

    console.log('[cloud-drive connect] env NEXT_PUBLIC_APP_URL:', envUrl || '(not set)')
    console.log('[cloud-drive connect] derived baseUrl:', baseUrl)
    console.log('[cloud-drive connect] host header:', host)
    console.log('[cloud-drive connect] protocol:', protocol)

    const url = getGoogleAuthUrl('thesisframe_connect', baseUrl)

    // Parse the generated URL to log the redirect_uri
    const parsed = new URL(url)
    console.log('[cloud-drive connect] redirect_uri:', parsed.searchParams.get('redirect_uri'))

    return NextResponse.json({ url })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Configuration manquante' },
      { status: 500 },
    )
  }
}
