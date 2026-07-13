import type { Metadata } from 'next'
import BlogIndexClient from './BlogIndexClient'

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
  return <BlogIndexClient />
}
