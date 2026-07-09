'use client'

import { useEffect, useRef, useState } from 'react'

const OVERLAY_LINKS = ['The Work', 'The Blog', 'About', 'Work With Me'] as const

interface RecentPost {
  title: string
  href: string
}

interface NavProps {
  bg: string
  recentPosts: RecentPost[]
}

export default function Nav({ bg, recentPosts }: NavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    let ticking = false
    function tick() {
      const y = window.scrollY
      if (y > 60 && y > lastY.current + 2) setHidden(true)
      else if (y < lastY.current - 2) setHidden(false)
      setScrolled(y > 60)
      lastY.current = y
      ticking = false
    }
    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(tick)
      }
    }
    lastY.current = window.scrollY
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <nav
        style={{
          backgroundColor: scrolled ? bg : 'transparent',
          transform: hidden ? 'translateY(-115%)' : 'translateY(0)',
        }}
        className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-7 transition-[transform,background-color] duration-300 ease-out md:px-16"
      >
        <div className="flex flex-wrap items-baseline gap-3.5">
          <span className="font-satoshi text-[15px] font-bold tracking-[0.22em] text-parchment">
            SLEEK WEALTH
          </span>
          <span className="hidden font-vollkorn text-base font-semibold italic text-cognac sm:inline">
            The Business of Luxury
          </span>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
          className="flex w-[38px] flex-col gap-[7px] p-2"
        >
          <span className="block h-[2.5px] w-full bg-parchment" />
          <span className="block h-[2.5px] w-full bg-parchment" />
        </button>
      </nav>

      <div
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-aubergine transition-opacity duration-[400ms] ease-sw"
      >
        <div className="flex items-center justify-between px-5 py-7 md:px-16">
          <span className="font-satoshi text-[15px] font-bold tracking-[0.22em] text-parchment">
            SLEEK WEALTH
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="px-2.5 py-1.5 font-satoshi text-[26px] leading-none text-parchment"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-wrap items-end gap-16 px-5 pb-[60px] pt-6 md:px-16 md:pb-[90px]">
          <div className="flex flex-1 basis-[360px] flex-col gap-3">
            {OVERLAY_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="font-vollkorn text-[38px] leading-[1.1] text-parchment md:text-[72px]"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex flex-1 basis-[320px] flex-col gap-[22px]" style={{ maxWidth: 460 }}>
            {recentPosts.map((post) => (
              <a key={post.title} href={post.href} className="flex items-center gap-[18px]">
                <div className="h-16 w-16 shrink-0 rounded-sw bg-[repeating-linear-gradient(45deg,#1d1023,#1d1023_8px,#170c1d_8px,#170c1d_16px)]" />
                <div className="flex flex-1 flex-col gap-[5px]">
                  <span className="font-satoshi text-[11px] uppercase tracking-[0.18em] text-cognac">
                    Blog
                  </span>
                  <span className="font-satoshi text-[15px] leading-[1.35] text-parchment">
                    {post.title}
                  </span>
                </div>
                <span className="font-satoshi text-lg text-cognac">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
