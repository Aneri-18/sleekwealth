import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import matter from 'gray-matter'
import { getFileContent } from '../../../lib/pixie/github'
import type { BlogPost } from '../../../data/posts'
import PixieEditor from '../../PixieEditor'

export const metadata: Metadata = {
  title: 'Pixie — Edit Post',
  robots: { index: false, follow: false },
}

// Always reads live GitHub state behind auth — never statically prerender this.
export const dynamic = 'force-dynamic'

export default async function PixieEditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await getFileContent(`content/blog/${slug}.md`)
  if (!raw) notFound()

  const { data, content } = matter(raw)
  const post: BlogPost = { ...(data as Omit<BlogPost, 'bodyHtml'>), bodyHtml: content.trim() }

  return <PixieEditor initialPost={post} />
}
