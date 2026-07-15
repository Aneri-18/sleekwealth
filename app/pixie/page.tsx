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

interface PostRow {
  slug: string
  title: string
  authorName: string
  category: string
  status: 'draft' | 'published'
  publishedAt: string
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
          authorName: data.authorName ?? '',
          category: data.category ?? '',
          status: data.status === 'published' ? 'published' : 'draft',
          publishedAt: data.publishedAt ?? '',
        } as PostRow
      })
  )
  return rows
    .filter((r): r is PostRow => r !== null)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
}

export default async function PixiePostsPage() {
  const posts = await loadPosts()
  const publishedCount = posts.filter((p) => p.status === 'published').length
  const draftCount = posts.length - publishedCount

  return (
    <div className="min-h-screen bg-aubergine px-5 py-14 text-parchment md:px-16">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-9 flex items-end justify-between">
          <div>
            <h1 className="font-vollkorn text-[34px] font-medium">Posts</h1>
            <p className="mt-1.5 font-satoshi text-sm text-parchment/70">
              {posts.length} total — {publishedCount} published, {draftCount} draft
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LogoutButton />
            <Link
              href="/pixie/new"
              className="rounded-[999px] border border-cognac bg-cognac px-5 py-2.5 font-satoshi text-sm font-semibold text-aubergine transition-colors duration-300 hover:bg-[#b17d47]"
            >
              + New Post
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_90px_130px_70px] gap-4 border-b border-cognac/30 px-1 pb-2.5 font-satoshi text-[11px] uppercase tracking-[0.06em] text-parchment/60">
          <div>Title</div>
          <div>Status</div>
          <div>Date</div>
          <div />
        </div>

        {posts.length === 0 && (
          <p className="py-10 text-center font-satoshi text-sm text-parchment/60">No posts yet.</p>
        )}

        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/pixie/${post.slug}/edit`}
            className="grid grid-cols-[2fr_90px_130px_70px] items-center gap-4 border-b border-cognac/20 px-1 py-4 transition-colors duration-200 hover:bg-white/[0.03]"
          >
            <div>
              <div className="font-vollkorn text-[17px]">{post.title}</div>
              <div className="mt-1 font-satoshi text-xs text-parchment/60">
                {post.authorName} · {post.category}
              </div>
            </div>
            <div>
              <span
                className={`w-fit rounded-full border px-2.5 py-1 font-satoshi text-[11px] ${
                  post.status === 'published' ? 'border-cognac text-cognac' : 'border-parchment/40 text-parchment/60'
                }`}
              >
                {post.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="font-satoshi text-[13px] text-parchment/70">{post.publishedAt}</div>
            <div className="text-right font-satoshi text-[13px] text-cognac">Edit →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
