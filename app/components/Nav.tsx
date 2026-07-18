'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import CTAButtons from './CTAButtons'

const OVERLAY_LINKS = [
  { label: 'The Work', href: '/work' },
  { label: 'The Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Work With Me', href: '#' },
] as const

interface RecentPost {
  title: string
  href: string
  image?: string
}

interface NavProps {
  bg: string
  recentPosts: RecentPost[]
}

export default function Nav({ bg, recentPosts }: NavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navCtaOpen, setNavCtaOpen] = useState(false)
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

  useEffect(() => {
    if (!isOpen) setNavCtaOpen(false)
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
        <a href="/" className="flex flex-wrap items-baseline gap-3.5">
          <span className="font-satoshi text-[15px] font-bold tracking-[0.22em] text-parchment">
            SLEEK WEALTH
          </span>
          <span className="hidden font-vollkorn text-base font-semibold italic text-cognac sm:inline">
            The Business of Luxury
          </span>
        </a>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[7px]"
        >
          <span className="block h-[2.5px] w-6 bg-parchment" />
          <span className="block h-[2.5px] w-6 bg-parchment" />
        </button>
      </nav>

      <div
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-aubergine transition-opacity duration-[400ms] ease-sw"
      >
        <div className="flex items-center justify-between px-5 py-7 md:px-16">
          <a
            href="/"
            className="font-satoshi text-[15px] font-bold tracking-[0.22em] text-parchment"
          >
            SLEEK WEALTH
          </a>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center font-satoshi text-2xl leading-none text-parchment"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-wrap items-end gap-16 px-5 pb-[60px] pt-6 md:px-16 md:pb-[90px]">
          <div className="flex flex-1 basis-[360px] flex-col gap-3">
            {OVERLAY_LINKS.map((link) =>
              link.label === 'Work With Me' ? (
                <div key={link.label} className="flex flex-col gap-4">
                  <button
                    type="button"
                    aria-expanded={navCtaOpen}
                    onClick={() => setNavCtaOpen((v) => !v)}
                    className="text-left font-vollkorn text-[38px] leading-[1.1] text-parchment md:text-[72px]"
                  >
                    {link.label}
                  </button>
                  <div
                    className="flex w-full max-w-[440px] flex-wrap gap-3.5 overflow-hidden transition-[max-height,opacity] duration-500 ease-sw"
                    style={{ maxHeight: navCtaOpen ? 160 : 0, opacity: navCtaOpen ? 1 : 0 }}
                  >
                    <CTAButtons />
                  </div>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-vollkorn text-[38px] leading-[1.1] text-parchment md:text-[72px]"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="flex flex-1 basis-[400px] flex-col gap-[19px]" style={{ maxWidth: 575 }}>
            {recentPosts.map((post) => (
              <a key={post.title} href={post.href} className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sw bg-[repeating-linear-gradient(45deg,#1d1023,#1d1023_8px,#170c1d_8px,#170c1d_16px)]">
                  {post.image && (
                    <Image src={post.image} alt="" fill sizes="56px" quality={95} className="object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="font-satoshi text-[10px] uppercase tracking-[0.18em] text-cognac">
                    Blog
                  </span>
                  <span className="font-satoshi text-[13px] leading-[1.35] text-parchment">
                    {post.title}
                  </span>
                </div>
                <span className="font-satoshi text-base text-cognac">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
