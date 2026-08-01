import { NextRequest, NextResponse } from 'next/server'

// Routes that don't require activation
const PUBLIC_PATHS = [
  '/api/auth/',
  '/_next',
  '/favicon',
  '/logo',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths (auth API, static assets)
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow static files
  if (pathname.startsWith('/_next/static') || pathname.endsWith('.ico') || pathname.endsWith('.png') || pathname.endsWith('.jpg')) {
    return NextResponse.next()
  }

  const sessionToken = req.cookies.get('tf_session')?.value

  if (!sessionToken) {
    // No cookie — if already on /, show activation page (client handles it)
    if (pathname === '/') {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Cookie exists — let through. Actual validation happens in /api/auth/status
  // called by the page component on mount.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
