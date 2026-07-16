import type { Metadata } from 'next'
import matter from 'gray-matter'
import Link from 'next/link'
import { listDirectory, getFileContent } from '../lib/pixie/github'
import LogoutButton from './LogoutButton'

export const metadata: Metadata = {
  title: 'Pixie — Posts',
  robots: { index: false, follow: false },
}

// Always reads live GitHub state behind auth — never statically prerender this.
export const dynamic = 'force-dynamic'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Frontmatter dates stay ISO (YYYY-MM-DD) for string-sort ordering — this only
// reformats them for display, e.g. "2026-10-18" -> "18-Oct-2026".
function formatDisplayDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!match) return '—'
  const [, year, month, day] = match
  return `${day}-${MONTHS[Number(month) - 1]}-${year}`
}

interface PostRow {
  slug: string
  title: string
  subtitle: string
  authorName: string
  category: string
  status: 'draft' | 'published'
  publishedAt: string
  updatedAt: string
  blogNo: number
}

async function loadPosts(): Promise<PostRow[]> {
  const files = await listDirectory('content/blog')
  const rows = await Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .map(async (file) => {
        const raw = await getFileContent(`content/blog/${file}`)
        if (!raw) return null
        const { data } = matter(raw)
        return {
          slug: file.replace(/\.md$/, ''),
          title: data.title ?? file,
          subtitle: data.subtitle ?? '',
          authorName: data.authorName ?? '',
          category: data.category ?? '',
          status: data.status === 'published' ? 'published' : 'draft',
          publishedAt: data.publishedAt ?? '',
          updatedAt: data.updatedAt ?? '',
        } as Omit<PostRow, 'blogNo'>
      })
  )
  const valid = rows.filter((r): r is Omit<PostRow, 'blogNo'> => r !== null)

  // Blog No. reflects chronological publish order (oldest = 1), independent of
  // the newest-first order this list is displayed in — so it never renumbers
  // existing posts when a new one is uploaded.
  const chronological = [...valid].sort((a, b) => (a.publishedAt || '').localeCompare(b.publishedAt || ''))
  const blogNoBySlug = new Map(chronological.map((r, i) => [r.slug, i + 1]))

  return valid
    .map((r) => ({ ...r, blogNo: blogNoBySlug.get(r.slug) ?? 0 }))
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
}

export default async function PixiePostsPage() {
  const posts = await loadPosts()
  const publishedCount = posts.filter((p) => p.status === 'published').length
  const draftCount = posts.length - publishedCount

  return (
    <div className="min-h-screen bg-aubergine px-5 py-14 text-parchment lg:px-16">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-vollkorn text-[34px] font-medium">Posts</h1>
            <div className="mt-1.5 flex flex-col gap-0.5 font-satoshi text-sm text-parchment/70">
              <p>Total = {posts.length}</p>
              <p>Published = {publishedCount}</p>
              <p>Draft(s) = {draftCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LogoutButton />
            <Link
              href="/pixie/new"
              className="whitespace-nowrap rounded-[999px] border border-cognac bg-cognac px-5 py-2.5 font-satoshi text-sm font-semibold text-aubergine transition-colors duration-300 hover:bg-[#b17d47]"
            >
              + New Post
            </Link>
          </div>
        </div>

        <div className="hidden border-b border-cognac/30 px-1 pb-2.5 font-satoshi text-[11px] uppercase tracking-[0.06em] text-parchment/60 lg:grid lg:grid-cols-[2fr_90px_110px_110px_70px] lg:gap-4">
          <div>Title</div>
          <div>Status</div>
          <div>Published</div>
          <div>Edited</div>
          <div />
        </div>

        {posts.length === 0 && (
          <p className="py-10 text-center font-satoshi text-sm text-parchment/60">No posts yet.</p>
        )}

        {posts.map((post) => {
          const statusLabel = post.status === 'published' ? 'Published' : 'Draft'
          const statusPill = (
            <span
              className={`w-fit rounded-full border px-2.5 py-1 font-satoshi text-[11px] ${
                post.status === 'published' ? 'border-cognac text-cognac' : 'border-parchment/40 text-parchment/60'
              }`}
            >
              {statusLabel}
            </span>
          )

          return (
            <Link
              key={post.slug}
              href={`/pixie/${post.slug}/edit`}
              className="block border-b border-cognac/20 px-1 py-4 transition-colors duration-200 hover:bg-white/[0.03] lg:grid lg:grid-cols-[2fr_90px_110px_110px_70px] lg:items-center lg:gap-4"
            >
              {/* Mobile: stacked label/value fields */}
              <div className="flex flex-col gap-1 font-satoshi text-[13px] lg:hidden">
                <p className="text-parchment/50">
                  Blog No.: <span className="text-parchment">{post.blogNo}</span>
                </p>
                <p className="font-vollkorn text-[17px] text-parchment">{post.title}</p>
                <p className="text-parchment/50">
                  Subtitle: <span className="text-parchment/80">{post.subtitle || '—'}</span>
                </p>
                <p className="text-parchment/50">
                  Category: <span className="text-parchment/80">{post.category || '—'}</span>
                </p>
                <p className="text-parchment/50">
                  Author: <span className="text-parchment/80">{post.authorName || '—'}</span>
                </p>
                <p className="text-parchment/50">
                  Status: <span className="text-parchment/80">{statusLabel}</span>
                </p>
                <p className="text-parchment/50">
                  Publish Date: <span className="text-parchment/80">{formatDisplayDate(post.publishedAt)}</span>
                </p>
                <p className="text-parchment/50">
                  Last Edit Date: <span className="text-parchment/80">{formatDisplayDate(post.updatedAt)}</span>
                </p>
                <p className="mt-1 text-cognac">Edit →</p>
              </div>

              {/* Desktop: table row */}
              <div className="hidden lg:block">
                <div className="font-vollkorn text-[17px]">{post.title}</div>
                <div className="mt-1 font-satoshi text-xs text-parchment/60">
                  {post.authorName} · {post.category}
                </div>
              </div>
              <div className="hidden lg:block">{statusPill}</div>
              <div className="hidden font-satoshi text-[13px] text-parchment/70 lg:block">{formatDisplayDate(post.publishedAt)}</div>
              <div className="hidden font-satoshi text-[13px] text-parchment/70 lg:block">{formatDisplayDate(post.updatedAt)}</div>
              <div className="hidden text-right font-satoshi text-[13px] text-cognac lg:block">Edit →</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
