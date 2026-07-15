import type { Metadata } from 'next'
import PixieEditor from '../PixieEditor'

export const metadata: Metadata = {
  title: 'Pixie — New Post',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function PixieNewPostPage() {
  return <PixieEditor />
}
