'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import CTAButtons from '../components/CTAButtons'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useAutoScrollStrip } from '../hooks/useAutoScrollStrip'
import type { BlogStripCard, NavPost } from '../data/posts-server'

const AUBERGINE = '#120818'
const BORDEAUX = '#4A0E1A'

interface AboutPageClientProps {
  posts: BlogStripCard[]
  navPosts: NavPost[]
}

export default function AboutPageClient({ posts, navPosts }: AboutPageClientProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [bg, setBg] = useState(AUBERGINE)
  const [headShown, setHeadShown] = useState(false)

  const parallaxRef = useRef<HTMLDivElement>(null)
  const parallaxWrapRef = useRef<HTMLDivElement>(null)

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

      const wrap = parallaxWrapRef.current
      const px = parallaxRef.current
      if (wrap && px) {
        const r = wrap.getBoundingClientRect()
        const mid = r.top + r.height / 2 - window.innerHeight / 2
        const shift = Math.max(-40, Math.min(40, mid * -0.08))
        px.style.transform = `translateY(${shift}px)`
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

  const strip = useAutoScrollStrip<HTMLDivElement>()

  const { ref: founderRef, inView: founderInView } = useInViewOnce<HTMLDivElement>()
  const { ref: philosophyRef, inView: philosophyInView } = useInViewOnce<HTMLDivElement>()
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
      <Nav bg={bg} recentPosts={navPosts} />

      {/* SECTION 1 — HERO */}
      <section
        data-bg="aubergine"
        className="flex flex-col items-center px-5 pb-16 pt-[150px] text-center md:px-16 md:pb-24"
      >
        <p className="mb-[22px] text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac">About.</p>
        <h1
          className="max-w-[18ch] overflow-hidden pb-[0.1em] text-[32px] font-medium leading-[1.35] tracking-[-0.01em] md:text-[72px]"
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
            Why I Built Sleek Wealth.
          </span>
        </h1>
      </section>

      {/* SECTION 2 — FOUNDER */}
      <section data-bg="aubergine" className="px-5 pb-20 pt-10 md:px-16 md:pb-[140px] md:pt-16">
        <div
          ref={founderRef}
          className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-10 md:grid-cols-[0.72fr_1fr] md:gap-20"
        >
          <div
            ref={parallaxWrapRef}
            style={fade(founderInView)}
            className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-sw md:mx-0 md:max-w-none"
          >
            <div
              ref={parallaxRef}
              className="absolute -top-[10%] left-0 h-[120%] w-full will-change-transform"
            >
              <Image
                src="/about/founder.jpg"
                alt="Aneri Shah"
                width={768}
                height={1191}
                unoptimized
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <span style={fade(founderInView)} className="font-vollkorn text-[19px] font-medium leading-[1.4] md:text-2xl">
              Business runs in the family. Luxury was a deliberate choice.
            </span>
            <p style={fade(founderInView, 100)} className="text-base leading-[1.7] text-parchment md:text-lg">
              Having had a bachelor&rsquo;s in business and a master&rsquo;s in luxury gave me an unprecedented
              foot in the door into the business of luxury. Years of research and study culminated to build
              Sleek Wealth.
            </p>
            <p style={fade(founderInView, 200)} className="text-base leading-[1.7] text-parchment md:text-lg">
              At 27, I beat cancer. And it gave me an uncommon clarity on what is valuable and what is noise.
              That clarity is exactly what SW is built on.
            </p>
            <p style={fade(founderInView, 300)} className="text-sm font-semibold tracking-[0.06em] text-cognac">
              Mumbai based. Globally focused.
            </p>
            <div style={fade(founderInView, 380)} className="mt-1">
              <CTAButtons />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — PHILOSOPHY */}
      <section
        data-bg="bordeaux"
        className="flex min-h-[70vh] items-center justify-center px-5 py-24 text-center md:px-16"
      >
        <div ref={philosophyRef} style={wipe(philosophyInView, 1200)} className="max-w-[920px]">
          <span className="font-vollkorn text-[30px] font-medium leading-[1.5] md:text-[58px]">
            Luxury is built, decision by decision, until it can no longer be mistaken for anything else.
          </span>
        </div>
      </section>

      {/* SECTION 4 — CTA */}
      <section data-bg="bordeaux" className="px-5 py-16 md:px-16 md:py-[140px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-9">
          <div ref={ctaTextRef} style={fade(ctaTextInView)}>
            <p className="max-w-[40ch] cursor-default text-center text-base leading-[1.6] text-parchment transition-[transform,color] duration-[400ms] ease-sw hover:scale-[1.03] hover:text-cognac md:text-xl">
              Turn your brilliance into luxury.
            </p>
          </div>
          <CTAButtons />
        </div>
      </section>

      {/* SECTION 5 — BLOG PREVIEW */}
      <section data-bg="aubergine" className="px-5 py-16 md:px-16 md:py-[140px]">
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
            className="mb-10 inline-block max-w-[18ch] text-[28px] font-medium leading-[1.4] md:mb-16 md:text-[64px]"
          >
            Delve into the world of Luxury, one blog at a time.
          </h2>
        </div>

        <div
          ref={strip.stripRef}
          data-hstrip
          onMouseEnter={strip.onMouseEnter}
          onMouseLeave={strip.onMouseLeave}
          onTouchStart={strip.onTouchStart}
          onTouchEnd={strip.onTouchEnd}
          className="flex gap-7 overflow-x-auto pb-10 pt-5"
        >
          {[...posts, ...posts].map((post, i) => (
            <BlogCard key={`${post.href}-${i}`} {...post} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
