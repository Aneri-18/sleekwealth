import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from './app/lib/pixie/session'

const PUBLIC_PIXIE_PATHS = new Set(['/pixie/login', '/api/pixie/login'])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_PIXIE_PATHS.has(pathname)) return NextResponse.next()

  const session = verifySessionCookieValue(request.cookies.get(SESSION_COOKIE_NAME)?.value)
  if (session) return NextResponse.next()

  if (pathname.startsWith('/api/pixie')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const loginUrl = new URL('/pixie/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/pixie/:path*', '/api/pixie/:path*'],
}
