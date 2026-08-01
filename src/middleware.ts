// Middleware disabled — license management is now handled from within the app.
// Kept as pass-through for potential future use.

import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
