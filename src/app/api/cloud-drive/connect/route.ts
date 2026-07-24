import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-drive'

export async function GET(req: NextRequest) {
  try {
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const host = req.headers.get('host') || 'localhost:3000'
    const envUrl = process.env.NEXT_PUBLIC_APP_URL
    const baseUrl = envUrl ? envUrl.replace(/\/+$/, '') : `${protocol}://${host}`

    const url = getGoogleAuthUrl('thesisframe_connect', baseUrl)
    const parsed = new URL(url)
    const redirectUri = parsed.searchParams.get('redirect_uri')!

    return NextResponse.json({
      url,
      debug: {
        NEXT_PUBLIC_APP_URL: envUrl || '(not set)',
        host_header: host,
        protocol_header: protocol,
        derived_baseUrl: baseUrl,
        redirect_uri: redirectUri,
        redirect_uri_no_trailing_slash: redirectUri.endsWith('/') ? '⚠️ ENDS WITH / — THIS WILL FAIL' : '✅ OK',
        redirect_uri_has_space: redirectUri.includes(' ') ? '⚠️ HAS SPACE — THIS WILL FAIL' : '✅ OK',
        redirect_uri_has_path: redirectUri.includes('/api/') ? '✅ Has path (normal for redirect)' : '⚠️ No path',
      },
      // What user MUST put in Google Console:
      google_console_config: {
        authorized_javascript_origin: new URL(redirectUri).origin,
        authorized_redirect_uri: redirectUri,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Configuration manquante' },
      { status: 500 },
    )
  }
}
