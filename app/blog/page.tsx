import type { Metadata } from 'next'
import { getAllPosts, getNavPosts } from '../data/posts-server'
import BlogIndexClient, { type GalleryPost } from './BlogIndexClient'

const RATIOS: Record<string, string> = {
  'the-three-types-of-luxury-consumers': '3/4',
}

export const metadata: Metadata = {
  title: 'The Blog — Sleek Wealth',
  description: 'The thinking behind the work. Delve into the world of Luxury, one blog at a time.',
  openGraph: {
    title: 'The Blog — Sleek Wealth',
    description: 'The thinking behind the work. Delve into the world of Luxury, one blog at a time.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Blog — Sleek Wealth',
    description: 'The thinking behind the work. Delve into the world of Luxury, one blog at a time.',
  },
}

export default function BlogPage() {
  const galleryPosts: GalleryPost[] = getAllPosts().map((p) => ({
    href: `/blog/${p.slug}`,
    image: p.featuredImage,
    title: p.title,
    date: new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    read: `${p.readingTime} min read`,
    author: p.authorName,
    category: p.category,
    ratio: RATIOS[p.slug] ?? '4/3',
  }))
  const navPosts = getNavPosts()

  return <BlogIndexClient galleryPosts={galleryPosts} navPosts={navPosts} />
}
