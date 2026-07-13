import type { Metadata } from 'next'
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
  return <WorkPageClient />
}
