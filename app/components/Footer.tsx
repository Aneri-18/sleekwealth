'use client'

import { useState } from 'react'
import CTAButtons from './CTAButtons'

const LINKS = ['The Work', 'The Blog', 'About', 'Work With Me'] as const

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.64h.05c.53-.99 1.83-2.04 3.77-2.04 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Footer() {
  const [showCTA, setShowCTA] = useState(false)

  return (
    <footer className="bg-aubergine px-6 py-16 md:px-12">
      <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
        {LINKS.map((link, i) => (
          <span key={link} className="flex items-center gap-3">
            {link === 'Work With Me' ? (
              <button
                type="button"
                onClick={() => setShowCTA((v) => !v)}
                className="font-vollkorn text-xl text-parchment transition-colors hover:text-cognac"
              >
                {link}
              </button>
            ) : (
              <a
                href="#"
                className="font-vollkorn text-xl text-parchment transition-colors hover:text-cognac"
              >
                {link}
              </a>
            )}
            {i < LINKS.length - 1 && (
              <span className="text-cognac">·</span>
            )}
          </span>
        ))}
      </nav>

      {showCTA && (
        <div className="mx-auto mt-8 max-w-md">
          <CTAButtons />
        </div>
      )}

      <div className="mt-10 flex justify-center gap-6 text-parchment">
        <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-cognac">
          <LinkedInIcon />
        </a>
        <a href="#" aria-label="Instagram" className="transition-colors hover:text-cognac">
          <InstagramIcon />
        </a>
      </div>

      <p className="mt-8 text-center font-satoshi text-label text-parchment/60">
        © Sleek Wealth 2026. The Business of Luxury.
      </p>
    </footer>
  )
}
