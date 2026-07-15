import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Pixie',
  robots: { index: false, follow: false },
}

export default function PixieLoginPage() {
  return <LoginForm />
}
