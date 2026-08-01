import { NextRequest, NextResponse } from 'next/server'

// Routes that don't require activation
const PUBLIC_PATHS = [
  '/api/',
  '/_next',
  '/favicon',
  '/logo',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths (all API routes, static assets)
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
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
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
