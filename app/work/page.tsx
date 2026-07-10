'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProgramListItem from '../components/ProgramListItem'
import OutcomesSection from '../components/OutcomesSection'
import BlogCard from '../components/BlogCard'
import CTAButtons from '../components/CTAButtons'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { PROGRAMS } from '../data/programs'

const AUBERGINE = '#120818'
const BORDEAUX = '#4A0E1A'

const OUTCOMES = [
  'Deliberate positioning.',
  'Pricing that signals correctly.',
  'A signal the market cannot misread.',
  'Perception that precedes the product.',
  'A brand that feels like it belongs where it charges.',
]

const POSTS = [
  { title: 'Why Premium and Luxury Are Not the Same Word', author: 'Aneri Shah', read: '6 min', offset: '0px' },
  { title: 'The Price Is the Position', author: 'Aneri Shah', read: '4 min', offset: '48px' },
  { title: 'What a Discount Actually Costs', author: 'Aneri Shah', read: '7 min', offset: '16px' },
  { title: 'The Room Is Never Just a Room', author: 'Aneri Shah', read: '5 min', offset: '56px' },
  { title: 'Founder Visibility, Brand Dilution', author: 'Aneri Shah', read: '8 min', offset: '8px' },
  { title: 'Becoming Inevitable', author: 'Aneri Shah', read: '5 min', offset: '40px' },
]

const NAV_POSTS = POSTS.slice(0, 3).map((p) => ({ title: p.title, href: '#' }))

export default function Work() {
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

  useEffect(() => {
    let raf: number
    function loop() {
      const s = stripRef.current
      if (s && !pausedRef.current) {
        if (s.scrollLeft >= s.scrollWidth - s.clientWidth - 1) s.scrollLeft = 0
        else s.scrollLeft += 0.4
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const { ref: ctaTextRef, inView: ctaTextInView } = useInViewOnce<HTMLDivElement>()
  const { ref: blogLabelRef, inView: blogLabelInView } = useInViewOnce<HTMLParagraphElement>()
  const { ref: blogHeadlineRef, inView: blogHeadlineInView } = useInViewOnce<HTMLHeadingElement>()

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
        className="flex flex-col items-start px-5 pb-10 pt-[150px] text-left md:px-16"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="mb-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac">
            The Work.
          </p>
          <h1 className="max-w-[24ch] overflow-hidden pb-[0.1em] text-[28px] font-medium leading-[1.35] tracking-[-0.01em] md:text-[46px]" style={{ fontFamily: 'var(--font-vollkorn)' }}>
            <span
              className="inline-block"
              style={{
                opacity: headShown ? 1 : 0,
                transform: headShown ? 'translateY(0)' : 'translateY(110%)',
                transition: 'opacity 700ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              Eight ways we help brands become inevitable.
            </span>
          </h1>
        </div>
      </section>

      {/* SECTION 2 — WORKINGS LIST */}
      <section data-bg="aubergine" className="px-5 pb-16 pt-16 md:px-16 md:pb-[90px] md:pt-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col">
            {PROGRAMS.map((item) => (
              <ProgramListItem
                key={item.slug}
                name={item.name}
                description={item.line}
                href={item.detail ? `/work/${item.slug}` : '#'}
              />
            ))}
            <div className="border-t border-cognac" />
          </div>
        </div>
      </section>

      {/* SECTION 3 — SCROLL-TRIGGERED OUTCOMES */}
      <OutcomesSection label="Every engagement moves a brand toward" outcomes={OUTCOMES} />

      {/* SECTION 4 — CTA */}
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

      {/* SECTION 5 — BLOG PREVIEW */}
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
          {POSTS.map((post) => (
            <BlogCard key={post.title} {...post} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
