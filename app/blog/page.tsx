'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BlogGalleryCard from '../components/BlogGalleryCard'
import { BLOG_CATEGORIES, categorySlug, getAllPosts, getNavPosts, type BlogCategory } from '../data/posts'

const AUBERGINE = '#120818'
const BORDEAUX = '#4A0E1A'

const RATIOS: Record<string, string> = {
  'the-three-types-of-luxury-consumers': '3/4',
}

const ALL_POSTS = getAllPosts()

const NAV_POSTS = getNavPosts()

const GALLERY_POSTS = ALL_POSTS.map((p) => ({
  href: `/blog/${p.slug}`,
  image: p.featuredImage,
  title: p.title,
  date: new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  read: `${p.readingTime} min read`,
  author: p.authorName,
  category: p.category,
  ratio: RATIOS[p.slug] ?? '4/3',
}))

export default function Blog() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [bg, setBg] = useState(AUBERGINE)
  const [headShown, setHeadShown] = useState(false)
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null)

  const visiblePosts = activeCategory
    ? GALLERY_POSTS.filter((p) => p.category === activeCategory)
    : GALLERY_POSTS

  useEffect(() => {
    const t = setTimeout(() => setHeadShown(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let ticking = false
    function tick() {
      const root = rootRef.current
      if (root) {
        const mid = window.innerHeight / 2
        let target = AUBERGINE
        root.querySelectorAll('[data-bg]').forEach((sec) => {
          const r = sec.getBoundingClientRect()
          if (r.top <= mid && r.bottom >= mid) {
            target = sec.getAttribute('data-bg') === 'bordeaux' ? BORDEAUX : AUBERGINE
          }
        })
        setBg((prev) => (prev !== target ? target : prev))
      }
      ticking = false
    }
    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(tick)
      }
    }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      style={{ backgroundColor: bg, transition: 'background-color 700ms ease' }}
      className="relative min-h-screen overflow-x-clip text-parchment"
    >
      <Nav bg={bg} recentPosts={NAV_POSTS} />

      {/* SECTION 1 — HERO */}
      <section
        data-bg="aubergine"
        className="flex min-h-[52vh] flex-col items-center justify-center px-5 pb-[50px] pt-[150px] text-center md:px-16"
      >
        <p className="mb-[22px] text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac">
          The Blog.
        </p>
        <h1
          className="max-w-[22ch] overflow-hidden pb-[0.1em] text-[40px] font-medium leading-[1.35] tracking-[-0.01em] md:text-[72px]"
          style={{ fontFamily: 'var(--font-vollkorn)' }}
        >
          <span
            className="inline-block"
            style={{
              opacity: headShown ? 1 : 0,
              transform: headShown ? 'translateY(0)' : 'translateY(110%)',
              transition: 'opacity 700ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            The thinking behind the work.
          </span>
        </h1>
      </section>

      {/* SECTION 2 — CATEGORY FILTER */}
      <section data-bg="aubergine" className="px-5 pb-8 md:px-16">
        <div className="mx-auto flex max-w-[1300px] flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            aria-pressed={activeCategory === null}
            className={`rounded-full border px-4 py-1.5 font-satoshi text-[13px] tracking-[0.02em] transition-colors duration-300 ${
              activeCategory === null
                ? 'border-cognac bg-[rgba(156,107,53,0.18)] text-parchment'
                : 'border-cognac/50 text-parchment/80 hover:bg-[rgba(156,107,53,0.14)]'
            }`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-category={categorySlug(cat)}
              onClick={() => setActiveCategory((prev) => (prev === cat ? null : cat))}
              aria-pressed={activeCategory === cat}
              className={`rounded-full border px-4 py-1.5 font-satoshi text-[13px] tracking-[0.02em] transition-colors duration-300 ${
                activeCategory === cat
                  ? 'border-cognac bg-[rgba(156,107,53,0.18)] text-parchment'
                  : 'border-cognac/50 text-parchment/80 hover:bg-[rgba(156,107,53,0.14)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3 — FLUID GALLERY */}
      <section data-bg="aubergine" className="px-5 pb-[100px] pt-5 md:px-16 md:pb-[150px] md:pt-11">
        {visiblePosts.length > 0 ? (
          <div className="mx-auto flex max-w-[1300px] flex-wrap items-start justify-center gap-4 md:gap-[26px]">
            {visiblePosts.map((post, i) => (
              <BlogGalleryCard key={post.href} {...post} priority={i === 0} />
            ))}
          </div>
        ) : (
          <p className="text-center font-satoshi text-sm text-parchment/60">
            No posts in this category yet.
          </p>
        )}
      </section>

      <Footer />
    </div>
  )
}
