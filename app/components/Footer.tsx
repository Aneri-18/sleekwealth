'use client'

import { useState } from 'react'
import CTAButtons from './CTAButtons'

const LINKS = [
  { label: 'The Work', href: '/work' },
  { label: 'The Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Work With Me', href: '#' },
] as const

export default function Footer() {
  const [ctaOpen, setCtaOpen] = useState(false)
  const year = new Date().getFullYear()

  return (
    <footer className="flex flex-col items-center gap-10 bg-aubergine px-6 pb-12 pt-[70px] md:px-16 md:pt-[120px]">
      <div className="flex flex-wrap items-baseline justify-center gap-5 md:gap-11">
        {LINKS.map((link) =>
          link.label === 'Work With Me' ? (
            <button
              key={link.label}
              type="button"
              aria-expanded={ctaOpen}
              onClick={() => setCtaOpen((v) => !v)}
              className="cursor-pointer font-vollkorn text-2xl text-parchment md:text-[30px]"
            >
              {link.label}
            </button>
          ) : (
            <a key={link.label} href={link.href} className="font-vollkorn text-2xl text-parchment md:text-[30px]">
              {link.label}
            </a>
          )
        )}
      </div>

      <div
        className="flex w-full max-w-[440px] flex-wrap justify-center gap-3.5 overflow-hidden transition-[max-height,opacity] duration-500 ease-sw"
        style={{ maxHeight: ctaOpen ? 160 : 0, opacity: ctaOpen ? 1 : 0 }}
      >
        <CTAButtons />
      </div>

      <div className="flex gap-7">
        <a href="#" className="font-satoshi text-[13px] tracking-[0.08em] text-cognac">
          LinkedIn
        </a>
        <a href="#" className="font-satoshi text-[13px] tracking-[0.08em] text-cognac">
          Instagram
        </a>
      </div>

      <p className="font-satoshi text-xs tracking-[0.04em] text-parchment/60">
        © Sleek Wealth {year}. The Business of Luxury.
      </p>
    </footer>
  )
}
