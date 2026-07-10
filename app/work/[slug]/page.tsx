import { notFound } from 'next/navigation'
import { PROGRAMS } from '../../data/programs'
import ProgramPageClient from './ProgramPageClient'

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = PROGRAMS.find((p) => p.slug === slug)

  if (!program || !program.detail) {
    notFound()
  }

  return <ProgramPageClient program={program} detail={program.detail} />
}
