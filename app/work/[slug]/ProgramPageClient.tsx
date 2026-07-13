'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import BlogCard from '../../components/BlogCard'
import CTAButtons from '../../components/CTAButtons'
import DarkeningParagraph from '../../components/DarkeningParagraph'
import ProgramFeatures from '../../components/ProgramFeatures'
import ProgramStack from '../../components/ProgramStack'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { PROGRAMS, type Program, type ProgramDetail } from '../../data/programs'
import { getBlogStripCards, getNavPosts } from '../../data/posts'

const AUBERGINE = '#120818'
const BORDEAUX = '#4A0E1A'

const POSTS = getBlogStripCards()
const NAV_POSTS = getNavPosts()

interface ProgramPageClientProps {
  program: Program
  detail: ProgramDetail
}

export default function ProgramPageClient({ program, detail }: ProgramPageClientProps) {
  const currentIndex = PROGRAMS.findIndex((p) => p.slug === program.slug)
  const index = currentIndex + 1
  const otherPrograms = [
    ...PROGRAMS.slice(currentIndex + 1),
    ...PROGRAMS.slice(0, currentIndex),
  ].map((p) => ({
    name: p.name,
    href: p.detail ? `/work/${p.slug}` : '#',
  }))

  const rootRef = useRef<HTMLDivElement>(null)
  const [bg, setBg] = useState(AUBERGINE)
  const [headShown, setHeadShown] = useState(false)

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

  const stripRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const stripPosRef = useRef(0)

  useEffect(() => {
    let raf: number
    function loop() {
      const s = stripRef.current
      if (s && !pausedRef.current) {
        // The strip renders its card set twice back-to-back, so wrapping at the
        // halfway point lands on an identical copy — the loop is seamless, no snap.
        const setWidth = s.scrollWidth / 2
        stripPosRef.current += 0.4
        if (stripPosRef.current >= setWidth) stripPosRef.current -= setWidth
        s.scrollLeft = stripPosRef.current
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const { ref: taglineRef, inView: taglineInView } = useInViewOnce<HTMLParagraphElement>()
  const { ref: ctaTextRef, inView: ctaTextInView } = useInViewOnce<HTMLDivElement>()
  const { ref: blogLabelRef, inView: blogLabelInView } = useInViewOnce<HTMLParagraphElement>()
  const { ref: blogHeadlineRef, inView: blogHeadlineInView } = useInViewOnce<HTMLHeadingElement>()
  const { ref: exploreLabelRef, inView: exploreLabelInView } = useInViewOnce<HTMLParagraphElement>()
  const { ref: exploreHeadlineRef, inView: exploreHeadlineInView } = useInViewOnce<HTMLHeadingElement>()

  const fade = (inView: boolean, delayMs = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms`,
  })

  const wipe = (inView: boolean, ms = 1000) => ({
    clipPath: inView ? 'inset(0 0% 0 0)' : 'inset(0 105% 0 0)',
    transition: `clip-path ${ms}ms cubic-bezier(0.16,1,0.3,1)`,
  })

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
        className="flex flex-col items-center px-5 pb-[70px] pt-[150px] text-center md:px-16"
      >
        <a
          href="/work"
          className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac"
        >
          <span>←</span>
          <span>The Work.</span>
        </a>
        <div ref={taglineRef} style={fade(taglineInView)} className="mb-[22px]">
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac">{index}</span>
        </div>
        <h1 className="overflow-hidden pb-[0.1em]">
          <span
            className="inline-block font-vollkorn text-[44px] font-medium leading-[1.3] tracking-[-0.01em] md:text-[88px]"
            style={{
              opacity: headShown ? 1 : 0,
              transform: headShown ? 'translateY(0)' : 'translateY(110%)',
              transition: 'opacity 700ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {program.name}.
          </span>
        </h1>
        <p
          style={fade(taglineInView, 150)}
          className="mt-[26px] max-w-[46ch] text-[17px] leading-[1.6] text-cognac md:text-xl"
        >
          {program.line}
        </p>
      </section>

      {/* SECTION 2 — HERO IMAGE */}
      <section data-bg="aubergine" className="px-5 pb-[70px] md:px-16 md:pb-[130px]">
        <div className="mx-auto flex aspect-[16/10] w-full max-w-[1200px] items-center justify-center overflow-hidden rounded-sw bg-[repeating-linear-gradient(45deg,#1c0f24,#1c0f24_11px,#160b1d_11px,#160b1d_22px)]">
          <span className="font-satoshi text-xs uppercase tracking-[0.14em] text-cognac">
            Editorial still — program image
          </span>
        </div>
      </section>

      {/* SECTION 3 — SIDEBAR + DARKENING PARAGRAPH */}
      <section data-bg="aubergine" className="px-5 pb-[90px] md:px-16 md:pb-[150px]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 md:grid-cols-[0.6fr_1fr] md:gap-[90px]">
          <div className="flex flex-col gap-3 md:sticky md:top-[190px]">
            <span className="text-[13px] uppercase tracking-[0.1em] text-cognac">Used for achieving</span>
            {detail.achievements.map((a) => (
              <span key={a} className="text-base leading-[1.6] text-parchment opacity-75">
                {a}
              </span>
            ))}
          </div>
          <DarkeningParagraph text={detail.paragraph} />
        </div>
      </section>

      {/* SECTION 4 — PROGRAM FEATURES */}
      <section data-bg="aubergine" className="px-5 py-16 md:px-16 md:py-[120px]">
        <div className="mx-auto max-w-[1100px]">
          <ProgramFeatures features={detail.features} />
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section data-bg="bordeaux" className="px-5 py-16 md:px-16 md:py-[140px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-9">
          <div ref={ctaTextRef} style={fade(ctaTextInView)}>
            <p className="max-w-[40ch] cursor-default text-center text-base leading-[1.6] text-parchment transition-[transform,color] duration-[400ms] ease-sw hover:scale-[1.03] hover:text-cognac md:text-xl">
              Discerning businesses never work alone.
            </p>
          </div>
          <CTAButtons />
        </div>
      </section>

      {/* SECTION 6 — EXPLORE MORE PROGRAMS */}
      <section data-bg="aubergine" className="px-5 py-16 text-center md:px-16 md:py-[130px]">
        <div className="mx-auto max-w-[1200px]">
          <p
            ref={exploreLabelRef}
            style={fade(exploreLabelInView)}
            className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac"
          >
            The Work.
          </p>
          <h2
            ref={exploreHeadlineRef}
            style={{ ...wipe(exploreHeadlineInView), fontFamily: 'var(--font-vollkorn)' }}
            className="mb-[60px] inline-block text-[32px] font-medium leading-[1.4] md:text-[52px]"
          >
            Explore More Workings.
          </h2>
          <ProgramStack programs={otherPrograms} />
        </div>
      </section>

      {/* SECTION 7 — BLOG PREVIEW */}
      <section data-bg="bordeaux" className="px-5 py-16 md:px-16 md:py-[140px]">
        <div className="mx-auto max-w-[1200px]">
          <p
            ref={blogLabelRef}
            style={fade(blogLabelInView)}
            className="mb-[22px] text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac"
          >
            The Blog.
          </p>
          <h2
            ref={blogHeadlineRef}
            style={{ ...wipe(blogHeadlineInView), fontFamily: 'var(--font-vollkorn)' }}
            className="mb-10 inline-block max-w-[18ch] text-[36px] font-medium leading-[1.4] md:mb-16 md:text-[64px]"
          >
            Delve into the world of Luxury, one blog at a time.
          </h2>
        </div>

        <div
          ref={stripRef}
          data-hstrip
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          className="flex gap-7 overflow-x-auto pb-10 pt-5"
        >
          {[...POSTS, ...POSTS].map((post, i) => (
            <BlogCard key={`${post.href}-${i}`} {...post} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
