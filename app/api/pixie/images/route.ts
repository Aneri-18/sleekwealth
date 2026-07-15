import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import sharp from 'sharp'
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from '../../../lib/pixie/session'
import { createOrUpdateFile } from '../../../lib/pixie/github'

export const runtime = 'nodejs'

function slugifyFilename(name: string): string {
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : ''
  const base = name
    .slice(0, name.length - ext.length)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${base || 'image'}-${Date.now()}${ext.toLowerCase()}`
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file')
  const slug = formData?.get('slug')
  if (!(file instanceof File) || typeof slug !== 'string' || !slug) {
    return NextResponse.json({ error: 'file and slug are required' }, { status: 400 })
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const metadata = await sharp(buffer).metadata()
  if (!metadata.width || !metadata.height) {
    return NextResponse.json({ error: 'Could not read image dimensions' }, { status: 400 })
  }

  const filename = slugifyFilename(file.name || 'image.png')
  const path = `public/blog/${slug}/${filename}`

  try {
    await createOrUpdateFile(path, buffer, `pixie: upload image for ${slug}`)
  } catch {
    return NextResponse.json({ error: 'Failed to commit image' }, { status: 502 })
  }

  return NextResponse.json({
    src: `/blog/${slug}/${filename}`,
    width: metadata.width,
    height: metadata.height,
  })
}
