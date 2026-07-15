import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PROGRAMS } from '../../data/programs'
import { getBlogStripCards, getNavPosts } from '../../data/posts-server'
import ProgramPageClient from './ProgramPageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = PROGRAMS.find((p) => p.slug === slug)
  if (!program || !program.detail) return {}

  return {
    title: `${program.name} — Sleek Wealth`,
    description: program.line,
    openGraph: {
      title: program.name,
      description: program.line,
      images: program.image ? [program.image] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: program.name,
      description: program.line,
      images: program.image ? [program.image] : undefined,
    },
  }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = PROGRAMS.find((p) => p.slug === slug)

  if (!program || !program.detail) {
    notFound()
  }

  const posts = getBlogStripCards()
  const navPosts = getNavPosts()

  return <ProgramPageClient program={program} detail={program.detail} posts={posts} navPosts={navPosts} />
}
