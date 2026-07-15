import { createHmac, timingSafeEqual } from 'node:crypto'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function createSessionCookieValue(username: string): string {
  const payload = JSON.stringify({ username, expiresAt: Date.now() + SESSION_TTL_MS })
  const encodedPayload = Buffer.from(payload, 'utf-8').toString('base64url')
  const signature = sign(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function verifySessionCookieValue(value: string | undefined | null): { username: string } | null {
  if (!value) return null
  const [encodedPayload, signature] = value.split('.')
  if (!encodedPayload || !signature) return null

  const expectedSignature = sign(encodedPayload)
  const a = Buffer.from(signature)
  const b = Buffer.from(expectedSignature)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8')) as {
      username: string
      expiresAt: number
    }
    if (typeof payload.expiresAt !== 'number' || payload.expiresAt < Date.now()) return null
    if (typeof payload.username !== 'string' || !payload.username) return null
    return { username: payload.username }
  } catch {
    return null
  }
}

export const SESSION_COOKIE_NAME = 'pixie_session'
