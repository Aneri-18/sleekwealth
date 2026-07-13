'use client'

import { useEffect, useState } from 'react'

export default function NotFound() {
  const [shown, setShown] = useState(false)
  const year = new Date().getFullYear()

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col bg-aubergine text-parchment">
      <nav className="absolute inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-7 md:px-16">
        <a href="/" className="flex flex-wrap items-baseline gap-3.5">
          <span className="font-satoshi text-[15px] font-bold tracking-[0.22em] text-parchment">
            SLEEK WEALTH
          </span>
          <span className="hidden font-vollkorn text-base font-semibold italic text-cognac sm:inline">
            The Business of Luxury
          </span>
        </a>
      </nav>

      <main className="flex flex-1 items-center justify-center px-5 pb-20 pt-[140px] md:px-16">
        <div
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)',
          }}
          className="flex max-w-[520px] flex-col gap-[22px]"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cognac">Error 404</span>
          <div className="h-px w-[60px] bg-cognac" />
          <h1 className="font-vollkorn text-[26px] font-medium leading-[1.4] md:text-[44px]">
            This is not where the brand lives.
          </h1>
          <a
            href="/"
            className="mt-2.5 w-fit border-b border-transparent pb-0.5 font-satoshi text-sm tracking-[0.04em] text-cognac transition-colors duration-200 ease-out hover:border-cognac"
          >
            Return to Sleek Wealth →
          </a>
        </div>
      </main>

      <footer className="px-5 pb-10 text-center md:px-16">
        <span className="font-satoshi text-xs tracking-[0.04em] text-parchment/50">
          © Sleek Wealth {year}. The Business of Luxury.
        </span>
      </footer>
    </div>
  )
}
