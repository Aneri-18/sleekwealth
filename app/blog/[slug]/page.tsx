import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '../../data/posts'
import BlogPostClient from './BlogPostClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} — Sleek Wealth`,
    description: post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images: [post.featuredImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.subtitle,
      images: [post.featuredImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostClient post={post} />
}
