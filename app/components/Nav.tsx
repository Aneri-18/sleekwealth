'use client'

import { useState } from 'react'
import CTAButtons from './CTAButtons'

const LINKS = ['The Work', 'The Blog', 'About', 'Work With Me'] as const

const RECENT_POSTS = [
  { title: 'Blog Post Title One', href: '#' },
  { title: 'Blog Post Title Two', href: '#' },
  { title: 'Blog Post Title Three', href: '#' },
]

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCTA, setShowCTA] = useState(false)

  const closeMenu = () => {
    setIsOpen(false)
    setShowCTA(false)
  }

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-transparent px-6 py-6 md:px-12">
        <div className="flex items-baseline gap-3">
          <span className="font-satoshi text-sm font-bold tracking-[0.2em] text-parchment">
            SLEEK WEALTH
          </span>
          <span className="hidden font-vollkorn italic text-sm text-cognac sm:inline">
            The Business of Luxury
          </span>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-end gap-2.5 p-2"
        >
          <span className="h-[3px] w-9 bg-parchment" />
          <span className="h-[3px] w-9 bg-parchment" />
        </button>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-aubergine">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute right-6 top-6 font-satoshi text-2xl text-parchment"
          >
            ✕
          </button>

          <div className="flex min-h-screen flex-col gap-16 px-6 py-24 md:flex-row md:px-16">
            <div className="flex flex-1 flex-col justify-center gap-6">
              {LINKS.map((link) =>
                link === 'Work With Me' ? (
                  <div key={link}>
                    <button
                      type="button"
                      onClick={() => setShowCTA((v) => !v)}
                      className="text-left font-vollkorn text-4xl text-parchment transition-colors hover:text-cognac md:text-6xl"
                    >
                      {link}
                    </button>
                    {showCTA && (
                      <div className="mt-6 max-w-md">
                        <CTAButtons />
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={link}
                    href="#"
                    className="font-vollkorn text-4xl text-parchment transition-colors hover:text-cognac md:text-6xl"
                  >
                    {link}
                  </a>
                )
              )}
            </div>

            <div className="flex flex-1 flex-col justify-center gap-8">
              {RECENT_POSTS.map((post) => (
                <a
                  key={post.title}
                  href={post.href}
                  className="group flex items-center gap-4"
                >
                  <div className="h-20 w-20 shrink-0 rounded-sw bg-bordeaux/50" />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-satoshi text-label uppercase tracking-widest text-cognac">
                      Blog
                    </span>
                    <span className="font-satoshi text-body-mobile text-parchment">
                      {post.title}
                    </span>
                  </div>
                  <span className="text-cognac transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
