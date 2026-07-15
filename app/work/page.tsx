import type { Metadata } from 'next'
import { getBlogStripCards, getNavPosts } from '../data/posts-server'
import WorkPageClient from './WorkPageClient'

export const metadata: Metadata = {
  title: 'The Work — Sleek Wealth',
  description: 'Eight ways we help brands become inevitable.',
  openGraph: {
    title: 'The Work — Sleek Wealth',
    description: 'Eight ways we help brands become inevitable.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Work — Sleek Wealth',
    description: 'Eight ways we help brands become inevitable.',
  },
}

export default function WorkPage() {
  const posts = getBlogStripCards()
  const navPosts = getNavPosts()
  return <WorkPageClient posts={posts} navPosts={navPosts} />
}
