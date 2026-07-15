import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from '../../../../lib/pixie/session'
import { deleteFile, getFileContent } from '../../../../lib/pixie/github'
import type { BlogPost } from '../../../../data/posts'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies()
  const session = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const raw = await getFileContent(`content/blog/${slug}.md`)
  if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, content } = matter(raw)
  const post: BlogPost = { ...(data as Omit<BlogPost, 'bodyHtml'>), bodyHtml: content.trim() }
  return NextResponse.json({ post })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies()
  const session = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  await deleteFile(`content/blog/${slug}.md`, `pixie: delete "${slug}"`)
  return NextResponse.json({ ok: true })
}
