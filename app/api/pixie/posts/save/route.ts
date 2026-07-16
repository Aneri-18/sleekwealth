import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from '../../../../lib/pixie/session'
import { createOrUpdateFile } from '../../../../lib/pixie/github'
import { sanitizePostBody, findFiguresMissingAltText, countFigures } from '../../../../lib/pixie/sanitize'
import { calculateReadingTime } from '../../../../lib/pixie/reading-time'
import { BLOG_CATEGORIES, type BlogCategory, type BlogPost } from '../../../../data/posts'

export const runtime = 'nodejs'

const MAX_FIGURES = 5

function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const {
    slug,
    title,
    subtitle,
    authorName,
    authorTitle,
    category,
    featuredImage,
    featuredImageWidth,
    featuredImageHeight,
    publishedAt,
    subheadingOverride,
    status,
    bodyHtml,
  } = body

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Slug must be lowercase letters, numbers, and hyphens only' }, { status: 400 })
  }
  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!BLOG_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }
  if (status !== 'draft' && status !== 'published') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  if (typeof bodyHtml !== 'string') {
    return NextResponse.json({ error: 'Body is required' }, { status: 400 })
  }

  const figureCount = countFigures(bodyHtml)
  if (figureCount > MAX_FIGURES) {
    return NextResponse.json({ error: `A post may have at most ${MAX_FIGURES} images in the body` }, { status: 400 })
  }
  const missingAlt = findFiguresMissingAltText(bodyHtml)
  if (missingAlt > 0) {
    return NextResponse.json({ error: `${missingAlt} image(s) are missing alt text` }, { status: 400 })
  }

  const sanitizedBody = sanitizePostBody(bodyHtml)
  const readingTime = calculateReadingTime(sanitizedBody)

  const frontmatter: Omit<BlogPost, 'bodyHtml'> = {
    slug,
    title: title.trim(),
    subtitle: typeof subtitle === 'string' ? subtitle.trim() : '',
    authorName: typeof authorName === 'string' && authorName.trim() ? authorName.trim() : 'Aneri Shah',
    authorTitle: typeof authorTitle === 'string' ? authorTitle.trim() : '',
    category: category as BlogCategory,
    featuredImage: typeof featuredImage === 'string' ? featuredImage : '',
    featuredImageWidth: Number(featuredImageWidth) || 0,
    featuredImageHeight: Number(featuredImageHeight) || 0,
    publishedAt: typeof publishedAt === 'string' && publishedAt ? publishedAt : new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    readingTime,
    status,
    ...(typeof subheadingOverride === 'string' && subheadingOverride.trim()
      ? { subheadingOverride: subheadingOverride.trim() }
      : {}),
  }

  const fileContents = matter.stringify(sanitizedBody, frontmatter)

  try {
    await createOrUpdateFile(
      `content/blog/${slug}.md`,
      Buffer.from(fileContents, 'utf-8'),
      `pixie: ${status === 'published' ? 'publish' : 'save draft'} "${frontmatter.title}"`
    )
  } catch {
    return NextResponse.json({ error: 'Failed to commit post to GitHub' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, slug })
}
