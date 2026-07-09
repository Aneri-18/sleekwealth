'use client'

import { useState, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'sw_cookie'

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
    <div className="fixed inset-x-0 bottom-0 z-[70] flex justify-center p-4">
      <div className="flex max-w-[760px] flex-wrap items-center gap-x-5 gap-y-3.5 rounded-sw border border-cognac bg-aubergine px-[18px] py-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        <span className="flex-1 basis-[280px] font-satoshi text-[13px] leading-[1.5] text-parchment">
          We use cookies to understand how this site is used.
        </span>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => respond('rejected')}
            className="rounded-sw border border-cognac px-4 py-2.5 font-satoshi text-[13px] text-parchment transition-colors hover:bg-cognac/10"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => respond('accepted')}
            className="rounded-sw border border-cognac bg-cognac px-[18px] py-2.5 font-satoshi text-[13px] font-medium text-aubergine transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
