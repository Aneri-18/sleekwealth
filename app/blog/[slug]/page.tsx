import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAdjacentPosts, getBlogStripCards, getNavPosts, getPostBySlug } from '../../data/posts-server'
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

  const navPosts = getNavPosts()
  const stripPosts = getBlogStripCards(5, post.slug)
  const { previous, next } = getAdjacentPosts(post.slug)

  return (
    <BlogPostClient
      post={post}
      navPosts={navPosts}
      stripPosts={stripPosts}
      previousPost={previous}
      nextPost={next}
    />
  )
}
