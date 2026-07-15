import type { Metadata } from 'next'
import { getBlogStripCards, getNavPosts } from '../data/posts-server'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About — Sleek Wealth',
  description: 'Why I built Sleek Wealth. Business runs in the family. Luxury was a deliberate choice.',
  openGraph: {
    title: 'About — Sleek Wealth',
    description: 'Why I built Sleek Wealth. Business runs in the family. Luxury was a deliberate choice.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Sleek Wealth',
    description: 'Why I built Sleek Wealth. Business runs in the family. Luxury was a deliberate choice.',
  },
}

export default function AboutPage() {
  const posts = getBlogStripCards()
  const navPosts = getNavPosts()
  return <AboutPageClient posts={posts} navPosts={navPosts} />
}
