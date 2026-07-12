'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import BlogCard from '../../components/BlogCard'
import CTAButtons from '../../components/CTAButtons'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { getNavPosts, type BlogPost } from '../../data/posts'

const AUBERGINE = '#120818'
const BORDEAUX = '#4A0E1A'

const NAV_POSTS = getNavPosts()

interface BlogPostClientProps {
  post: BlogPost
  related: BlogPost[]
}

export default function BlogPostClient({ post, related }: BlogPostClientProps) {
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

  const { ref: taglineRef, inView: taglineInView } = useInViewOnce<HTMLDivElement>()
  const { ref: ctaTextRef, inView: ctaTextInView } = useInViewOnce<HTMLDivElement>()
  const { ref: relatedLabelRef, inView: relatedLabelInView } = useInViewOnce<HTMLParagraphElement>()
  const { ref: relatedHeadlineRef, inView: relatedHeadlineInView } = useInViewOnce<HTMLHeadingElement>()

  const fade = (inView: boolean, delayMs = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms`,
  })

  const wipe = (inView: boolean, ms = 1000) => ({
    clipPath: inView ? 'inset(0 0% 0 0)' : 'inset(0 105% 0 0)',
    transition: `clip-path ${ms}ms cubic-bezier(0.16,1,0.3,1)`,
  })

  const publishedLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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
          href="/blog"
          className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac"
        >
          <span>←</span>
          <span>The Blog.</span>
        </a>
        <div ref={taglineRef} style={fade(taglineInView)} className="mb-[22px]">
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac">
            {post.category}
          </span>
        </div>
        <h1 className="mx-auto max-w-[22ch] overflow-hidden pb-[0.1em]">
          <span
            className="inline-block font-vollkorn text-[30px] font-medium leading-[1.3] tracking-[-0.01em] md:text-[48px]"
            style={{
              opacity: headShown ? 1 : 0,
              transform: headShown ? 'translateY(0)' : 'translateY(110%)',
              transition: 'opacity 700ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {post.title}
          </span>
        </h1>
        <p
          style={fade(taglineInView, 150)}
          className="mt-[26px] max-w-[56ch] text-[17px] leading-[1.6] text-cognac md:text-xl"
        >
          {post.subtitle}
        </p>
        <div
          style={fade(taglineInView, 220)}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-parchment/80"
        >
          <span>{post.authorName}</span>
          {post.authorTitle && (
            <>
              <span className="text-cognac">·</span>
              <span>{post.authorTitle}</span>
            </>
          )}
          <span className="text-cognac">·</span>
          <span>{publishedLabel}</span>
          <span className="text-cognac">·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </section>

      {/* SECTION 2 — FEATURED IMAGE */}
      <section data-bg="aubergine" className="px-5 pb-[70px] md:px-16 md:pb-[130px]">
        <div className="relative mx-auto aspect-[16/10] w-full max-w-[1200px] overflow-hidden rounded-sw bg-[repeating-linear-gradient(45deg,#1c0f24,#1c0f24_11px,#160b1d_11px,#160b1d_22px)]">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 900px) 100vw, 1200px"
            quality={95}
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* SECTION 3 — BODY */}
      <section data-bg="aubergine" className="px-5 pb-[90px] md:px-16 md:pb-[150px]">
        <div
          className="mx-auto max-w-[720px] space-y-6 text-base leading-[1.8] text-parchment md:text-lg [&>h2]:mb-1 [&>h2]:mt-14 [&>h2]:font-vollkorn [&>h2]:text-[26px] [&>h2]:font-medium [&>h2]:leading-[1.3] [&>h3]:mb-1 [&>h3]:mt-8 [&>h3]:font-vollkorn [&>h3]:text-[21px] [&>h3]:font-medium [&>h3]:leading-[1.3] [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-6 [&_a]:text-cognac [&_a]:underline [&_a]:decoration-cognac/50 [&_a]:underline-offset-2 [&_em]:italic [&_strong]:font-semibold [&_strong]:text-parchment md:[&>h2]:text-[32px] md:[&>h3]:text-[24px]"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      </section>

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

      {/* SECTION 5 — RECENT POSTS */}
      {related.length > 0 && (
        <section data-bg="bordeaux" className="px-5 py-16 text-center md:px-16 md:py-[130px]">
          <div className="mx-auto max-w-[1200px]">
            <p
              ref={relatedLabelRef}
              style={fade(relatedLabelInView)}
              className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac"
            >
              The Blog.
            </p>
            <h2
              ref={relatedHeadlineRef}
              style={{ ...wipe(relatedHeadlineInView), fontFamily: 'var(--font-vollkorn)' }}
              className="mb-[60px] inline-block text-[32px] font-medium leading-[1.4] md:text-[52px]"
            >
              Recent Posts.
            </h2>
            <div className="grid grid-cols-1 justify-items-center gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
              {related.map((p) => (
                <BlogCard
                  key={p.slug}
                  title={p.title}
                  author={p.authorName}
                  read={`${p.readingTime} min`}
                  offset="0px"
                  href={`/blog/${p.slug}`}
                  image={p.featuredImage}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
