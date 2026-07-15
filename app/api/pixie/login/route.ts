import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyCredentials } from '../../../lib/pixie/auth'
import { createSessionCookieValue, SESSION_COOKIE_NAME } from '../../../lib/pixie/session'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
  }

  let ok: boolean
  try {
    ok = verifyCredentials(username, password)
  } catch {
    return NextResponse.json({ error: 'Pixie is not configured yet' }, { status: 500 })
  }

  if (!ok) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, createSessionCookieValue(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({ ok: true })
}
