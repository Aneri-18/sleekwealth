'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/pixie/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Something went wrong')
        setSubmitting(false)
        return
      }
      router.push('/pixie')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-aubergine px-5 text-parchment">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px] text-center">
        <div className="text-[15px] font-semibold tracking-[0.22em] text-cognac">SLEEK WEALTH</div>
        <h1 className="my-7 font-vollkorn text-[30px] font-medium">Pixie</h1>

        <div className="mb-[18px] text-left">
          <label className="mb-1.5 block text-xs text-parchment/70">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full rounded-sw border border-cognac/40 bg-transparent px-3.5 py-3 font-satoshi text-sm text-parchment outline-none focus:border-cognac"
          />
        </div>
        <div className="mb-[18px] text-left">
          <label className="mb-1.5 block text-xs text-parchment/70">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-sw border border-cognac/40 bg-transparent px-3.5 py-3 font-satoshi text-sm text-parchment outline-none focus:border-cognac"
          />
        </div>

        {error && <p className="mb-3 text-left text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2.5 w-full rounded-[999px] border border-cognac bg-cognac px-6 py-3 font-satoshi text-sm font-semibold text-aubergine transition-colors duration-300 hover:bg-[#b17d47] disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
