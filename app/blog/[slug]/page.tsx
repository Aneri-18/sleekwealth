import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts } from '../../data/posts'
import BlogPostClient from './BlogPostClient'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const related = getRelatedPosts(slug, 3)

  return <BlogPostClient post={post} related={related} />
}
