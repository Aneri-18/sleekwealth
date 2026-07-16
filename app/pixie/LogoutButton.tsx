'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/pixie/logout', { method: 'POST' })
    router.push('/pixie/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="whitespace-nowrap rounded-[999px] border border-cognac/50 px-4 py-2.5 font-satoshi text-sm text-parchment transition-colors duration-300 hover:bg-[rgba(156,107,53,0.14)]"
    >
      Log out
    </button>
  )
}
