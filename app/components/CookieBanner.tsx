'use client'

import { useState, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'sw-cookie-consent'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY)
}

function getServerSnapshot() {
  return null
}

export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [dismissed, setDismissed] = useState(false)

  const respond = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY, choice)
    setDismissed(true)
  }

  if (consent || dismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-3 rounded-sw border border-cognac/30 bg-aubergine p-4 shadow-lg sm:left-auto sm:right-4 sm:w-80 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-satoshi text-label text-parchment">
        We use cookies to improve your experience.
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => respond('accepted')}
          className="rounded-sw border border-cognac px-3 py-1.5 font-satoshi text-label text-parchment transition-colors hover:bg-cognac/10"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => respond('rejected')}
          className="rounded-sw px-3 py-1.5 font-satoshi text-label text-parchment/60 transition-colors hover:text-parchment"
        >
          Reject non-essential
        </button>
      </div>
    </div>
  )
}
