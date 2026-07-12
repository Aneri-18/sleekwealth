'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ExpandingContainer from './components/ExpandingContainer'
import StoryCards from './components/StoryCards'
import ProgramListItem from './components/ProgramListItem'
import BlogCard from './components/BlogCard'
import CTAButtons from './components/CTAButtons'
import { useInViewOnce } from './hooks/useInViewOnce'
import { getBlogStripCards, getNavPosts } from './data/posts'

const AUBERGINE = '#120818'
const BORDEAUX = '#4A0E1A'

const WORK_ITEMS = [
  {
    name: 'Positioning Clarity',
    line: "Your brand is saying something. The question is whether it's saying what you intend.",
  },
  { name: 'Pricing Architecture', line: 'Price is not a number. It is a signal.' },
  {
    name: 'Brand Dilution Audit',
    line: 'A discount. A collaboration. A second line. Each felt reasonable at the time.',
  },
  {
    name: 'Founder Positioning',
    line: 'You are visible. The question is whether your visibility is building the brand or diluting it.',
  },
  { name: 'Spatial Experience', line: 'The room is never just a room.' },
]

const STEPS = [
  { num: '1', title: 'Reach Out.', body: 'Just say Hello.' },
  {
    num: '2',
    title: 'We Talk.',
    body: 'A short call to understand where your brand stands and where it needs to go.',
  },
  {
    num: '3',
    title: 'We Begin.',
    body: 'From exactly where your brand stands. Nothing assumed. Nothing rushed.',
  },
]

const POSTS = getBlogStripCards()
const NAV_POSTS = getNavPosts()

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [bg, setBg] = useState(AUBERGINE)
  const [headShown, setHeadShown] = useState(false)
  const [boxShown, setBoxShown] = useState({ L: false, R: false, F: false })

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

      const y = window.scrollY
      setBoxShown((prev) => {
        const next = { ...prev }
        if (!next.L && y >= 20) next.L = true
        if (!next.R && y >= 90) next.R = true
        if (!next.F && y >= 160) next.F = true
        return prev.L === next.L && prev.R === next.R && prev.F === next.F ? prev : next
      })

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
        const max = s.scrollWidth - s.clientWidth
        stripPosRef.current += 0.4
        if (stripPosRef.current >= max) stripPosRef.current = 0
        s.scrollLeft = stripPosRef.current
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const { ref: introRef, inView: introInView } = useInViewOnce<HTMLDivElement>()
  const { ref: equationRef, inView: equationInView } = useInViewOnce<HTMLSpanElement>()
  const { ref: trinitySupportRef, inView: trinitySupportInView } = useInViewOnce<HTMLDivElement>()
  const { ref: workLabelRef, inView: workLabelInView } = useInViewOnce<HTMLParagraphElement>()
  const { ref: workHeadlineRef, inView: workHeadlineInView } = useInViewOnce<HTMLHeadingElement>()
  const { ref: workLinkRef, inView: workLinkInView } = useInViewOnce<HTMLDivElement>()
  const { ref: howHeadlineRef, inView: howHeadlineInView } = useInViewOnce<HTMLHeadingElement>()
  const { ref: howTaglineRef, inView: howTaglineInView } = useInViewOnce<HTMLParagraphElement>()
  const { ref: blogLabelRef, inView: blogLabelInView } = useInViewOnce<HTMLParagraphElement>()
  const { ref: blogHeadlineRef, inView: blogHeadlineInView } = useInViewOnce<HTMLHeadingElement>()
  const { ref: ctaTextRef, inView: ctaTextInView } = useInViewOnce<HTMLDivElement>()

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
      className="relative min-h-screen overflow-x-hidden text-parchment"
    >
      <Nav bg={bg} recentPosts={NAV_POSTS} />

      {/* SECTION 1 — HERO */}
      <section
        data-bg="aubergine"
        className="flex min-h-screen flex-col items-center justify-center px-5 pb-14 pt-[104px] text-center sm:pt-[120px] md:px-16"
      >
        <h1 className="mt-14 mb-[52px] overflow-hidden text-[44px] font-medium leading-[1.4] tracking-[-0.01em] sm:mt-[56px] sm:mb-[52px] md:mt-[120px] md:mb-24 md:text-[96px]" style={{ fontFamily: 'var(--font-vollkorn)' }}>
          <span
            className="inline-block"
            style={{
              opacity: headShown ? 1 : 0,
              transform: headShown ? 'translateY(0)' : 'translateY(110%)',
              transition: 'opacity 700ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            Luxury is a Language.
          </span>
        </h1>

        <div className="flex w-full flex-wrap items-start justify-center gap-4">
          <div className="w-full sm:w-auto" style={fade(boxShown.L)}>
            <div className="cursor-default whitespace-normal rounded-[26px] border border-cognac px-6 py-4 text-center text-base leading-[1.7] text-parchment transition-[transform,background-color,border-color] duration-300 ease-out hover:scale-[1.04] hover:border-transparent hover:bg-bordeaux sm:mx-auto sm:w-fit sm:whitespace-nowrap sm:px-8">
              And like any language, fluency takes years to build.
            </div>
          </div>
          <div className="w-full sm:w-auto" style={fade(boxShown.R)}>
            <div className="cursor-default whitespace-normal rounded-[26px] border border-cognac px-6 py-4 text-center text-base leading-[1.7] text-parchment transition-[transform,background-color,border-color] duration-300 ease-out hover:scale-[1.04] hover:border-transparent hover:bg-bordeaux sm:mx-auto sm:w-fit sm:whitespace-nowrap sm:px-8">
              If luxury and premium is your space, then Sleek Wealth was built for you.
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-center" style={fade(boxShown.F)}>
          <div className="w-full cursor-default whitespace-normal rounded-[26px] border border-cognac px-6 py-4 text-center text-base leading-[1.7] text-parchment transition-[transform,background-color,border-color] duration-300 ease-out hover:scale-[1.04] hover:border-transparent hover:bg-bordeaux sm:mx-auto sm:w-fit sm:whitespace-nowrap sm:px-8">
            To help you master this fluency faster.
          </div>
        </div>
      </section>

      {/* SECTION 2 — EXPANDING CONTAINER + INTRO */}
      <section data-bg="aubergine" className="flex flex-col items-center px-5 pb-[36px] pt-20 md:px-16 md:pb-[65px] md:pt-40">
        <ExpandingContainer placeholderLabel="Editorial still — piano, single light source (image or video)" />
        <div
          ref={introRef}
          style={fade(introInView)}
          className="mt-[72px] flex max-w-[720px] flex-col gap-1.5 text-center md:mt-[130px]"
        >
          <p className="text-lg leading-[1.7] text-parchment md:text-2xl">
            Luxury lives and dies by positioning.
          </p>
          <p className="text-lg leading-[1.7] text-parchment md:text-2xl">
            Understanding it is where the real work begins.
          </p>
        </div>
      </section>

      {/* SECTION 3 — THE TRINITY */}
      <section data-bg="bordeaux" className="px-5 pb-[90px] pt-9 text-center md:px-16 md:pb-[170px] md:pt-16">
        <div className="px-4 md:px-12">
          <span
            ref={equationRef}
            style={{ ...wipe(equationInView, 1200), fontFamily: 'var(--font-vollkorn)' }}
            className="inline-block whitespace-normal text-[30px] font-medium leading-[1.35] sm:text-[clamp(30px,6.4vw,46px)] md:whitespace-nowrap md:text-[clamp(26px,4.6vw,58px)] md:leading-[1.4]"
          >
            Positioning = Pricing + Perception
          </span>
        </div>
        <div
          ref={trinitySupportRef}
          style={fade(trinitySupportInView)}
          className="mx-auto mt-[72px] flex max-w-[760px] flex-col gap-3.5 md:mt-[130px]"
        >
          <p className="text-lg leading-[1.7] text-parchment md:text-2xl">
            Every consequential decision, whether it be a new market, a strategy, an expansion, or
            a repositioning, ultimately traces back to these three forces.
          </p>
          <p className="text-lg leading-[1.7] text-parchment md:text-2xl">
            At Sleek Wealth, every conversation is anchored in them.
          </p>
        </div>
      </section>

      {/* SECTION 4 — THE WORK PREVIEW */}
      <section data-bg="bordeaux" className="px-5 py-16 md:px-16 md:py-[140px]">
        <div className="mx-auto max-w-[1200px]">
          <p
            ref={workLabelRef}
            style={fade(workLabelInView)}
            className="mb-[22px] text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac"
          >
            The Work.
          </p>
          <h2
            ref={workHeadlineRef}
            style={{ ...wipe(workHeadlineInView), fontFamily: 'var(--font-vollkorn)' }}
            className="mb-10 inline-block max-w-[16ch] text-[36px] font-medium leading-[1.4] md:mb-[72px] md:text-[64px]"
          >
            Eight ways we help brands become inevitable.
          </h2>

          <div className="flex flex-col">
            {WORK_ITEMS.map((item) => (
              <ProgramListItem key={item.name} name={item.name} description={item.line} />
            ))}
            <div className="border-t border-cognac" />
          </div>

          <div ref={workLinkRef} style={fade(workLinkInView)} className="mt-9">
            <a
              href="#"
              className="[background-image:linear-gradient(#9C6B35,#9C6B35)] [background-position:0_100%] [background-size:0%_1px] bg-no-repeat text-sm font-semibold tracking-[0.06em] text-cognac transition-[background-size] duration-200 ease-out hover:[background-size:100%_1px]"
            >
              All eight →
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section data-bg="aubergine" className="px-5 py-16 md:px-16 md:py-[140px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 md:mb-16">
            <h2
              ref={howHeadlineRef}
              style={{ ...wipe(howHeadlineInView), fontFamily: 'var(--font-vollkorn)' }}
              className="inline-block text-[36px] font-medium leading-[1.4] md:text-[64px]"
            >
              How It Works.
            </h2>
            <p
              ref={howTaglineRef}
              style={fade(howTaglineInView)}
              className="mt-3.5 text-[15px] font-semibold tracking-[0.04em] text-cognac"
            >
              As easy as 1-2-3.
            </p>
          </div>
          <StoryCards cards={STEPS} />
        </div>
      </section>

      {/* SECTION 6 — THE BLOG PREVIEW + CTA */}
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
            <BlogCard key={post.href} {...post} />
          ))}
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-9 pt-[84px] md:pt-40">
          <div ref={ctaTextRef} style={fade(ctaTextInView)}>
            <p className="max-w-[40ch] cursor-default text-center text-base leading-[1.6] text-parchment transition-[transform,color] duration-[400ms] ease-sw hover:scale-[1.03] hover:text-cognac md:text-xl">
              If you have read this far, you already know if this is for you.
            </p>
          </div>
          <CTAButtons />
        </div>
      </section>

      <Footer />
    </div>
  )
}
