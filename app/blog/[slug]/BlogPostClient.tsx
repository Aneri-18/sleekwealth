'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import BlogCard from '../../components/BlogCard'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { useAutoScrollStrip } from '../../hooks/useAutoScrollStrip'
import type { BlogPost } from '../../data/posts'
import type { AdjacentPosts, BlogStripCard, NavPost } from '../../data/posts-server'

const AUBERGINE = '#120818'
const BORDEAUX = '#4A0E1A'
const WHATSAPP_NUMBER = '919987357331'

interface BlogPostClientProps {
  post: BlogPost
  navPosts: NavPost[]
  stripPosts: BlogStripCard[]
  previousPost: AdjacentPosts['previous']
  nextPost: AdjacentPosts['next']
}

export default function BlogPostClient({ post, navPosts, stripPosts, previousPost, nextPost }: BlogPostClientProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLDivElement>(null)
  const { ref: subheadingRef, inView: subheadingInView } = useInViewOnce<HTMLParagraphElement>()
  const subheading = post.subtitle
  const [bg, setBg] = useState(AUBERGINE)
  const [headShown, setHeadShown] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  const previous = previousPost
  const next = nextPost

  // Stable reference so the dangerouslySetInnerHTML div isn't reconciled (and its
  // manually-animated headings reset) on every unrelated re-render (e.g. shareUrl).
  const bodyHtmlProp = useMemo(() => ({ __html: post.bodyHtml }), [post.bodyHtml])

  useEffect(() => {
    const t = setTimeout(() => setHeadShown(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [post.slug])

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

  // Article body headings (raw HTML from dangerouslySetInnerHTML, so not individual
  // React elements) type themselves out on scroll-into-view, via direct DOM manipulation.
  useEffect(() => {
    const container = articleRef.current
    if (!container) return
    const targets = Array.from(container.querySelectorAll('h2, h3')) as HTMLElement[]
    if (targets.length === 0) return

    const fullText = new Map<HTMLElement, string>()
    targets.forEach((el) => {
      fullText.set(el, el.textContent || '')
      el.textContent = ''
    })

    const intervals: ReturnType<typeof setInterval>[] = []
    // threshold stays 0 — an empty-text element still has a normal line-height box,
    // but keeping this consistent with useInViewOnce's proven config either way.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          observer.unobserve(el)
          const text = fullText.get(el) || ''
          let i = 0
          const id = setInterval(() => {
            i += 1
            el.textContent = text.slice(0, i)
            if (i >= text.length) clearInterval(id)
          }, 18)
          intervals.push(id)
        })
      },
      { threshold: 0, rootMargin: '0px 0px -15% 0px' }
    )
    targets.forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      intervals.forEach((id) => clearInterval(id))
    }
  }, [post.slug])

  const strip = useAutoScrollStrip<HTMLDivElement>()

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

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const softCtaHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Aneri, I read "${post.title}" and wanted to talk about my brand's positioning.`
  )}`

  const shareLinks = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${shareUrl}`)}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`,
    },
  ]

  return (
    <div
      ref={rootRef}
      style={{ backgroundColor: bg, transition: 'background-color 700ms ease' }}
      className="relative min-h-screen overflow-x-clip text-parchment"
    >
      <Nav bg={bg} recentPosts={navPosts} />

      {/* SECTION 1 — BREADCRUMB + HERO IMAGE */}
      <section data-bg="aubergine" className="flex flex-col items-center px-5 pt-[150px] md:px-16">
        <a
          href="/blog"
          className="mb-10 inline-flex items-center gap-2 self-start text-[12px] font-medium uppercase tracking-[0.18em] text-cognac/70 transition-colors duration-300 hover:text-cognac md:self-center"
        >
          <span>←</span>
          <span>The Blog.</span>
        </a>
        <div className="mx-auto w-full max-w-[560px]">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            width={post.featuredImageWidth}
            height={post.featuredImageHeight}
            sizes="(max-width: 600px) 90vw, 560px"
            quality={95}
            priority
            className="mx-auto block rounded-sw"
            style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '65vh' }}
          />
          {post.featuredImageCaption && (
            <p className="mt-3 text-center font-satoshi text-[13px] text-parchment/60">
              {post.featuredImageCaption}
            </p>
          )}
        </div>
      </section>

      {/* SECTION 2 — TITLE + BYLINE */}
      <section
        data-bg="aubergine"
        className="flex flex-col items-center px-5 pb-[70px] pt-[52px] text-center md:px-16"
      >
        <div className="mb-[22px]">
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac">
            {post.category}
          </span>
        </div>
        <h1 className="mx-auto max-w-full overflow-hidden pb-[0.1em] md:max-w-[820px]">
          <span
            className="inline-block font-vollkorn text-[22px] font-medium leading-[1.3] tracking-[-0.01em] md:text-[48px]"
            style={{
              opacity: headShown ? 1 : 0,
              transform: headShown ? 'translateY(0)' : 'translateY(110%)',
              transition: 'opacity 700ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {post.title}
          </span>
        </h1>
        {subheading && (
          <p
            ref={subheadingRef}
            style={fade(subheadingInView)}
            className="mx-auto mt-6 max-w-[56ch] font-vollkorn text-lg italic leading-[1.6] text-cognac md:text-xl"
          >
            {subheading}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-parchment/80">
          <span>{publishedLabel}</span>
          <span className="text-cognac">·</span>
          <span>{post.readingTime} min read</span>
          <span className="text-cognac">·</span>
          <span>{post.authorName}</span>
          {post.authorTitle && (
            <>
              <span className="text-cognac">·</span>
              <span>{post.authorTitle}</span>
            </>
          )}
        </div>
      </section>

      {/* SECTION 3 — BODY */}
      <section data-bg="aubergine" className="px-5 pb-[60px] md:px-16">
        <div
          ref={articleRef}
          className="mx-auto max-w-[720px] space-y-6 text-base leading-[1.8] text-parchment md:text-lg [&>h2]:my-10 [&>h2]:font-vollkorn [&>h2]:text-[26px] [&>h2]:font-medium [&>h2]:leading-[1.3] [&>h3]:my-10 [&>h3]:font-vollkorn [&>h3]:text-[21px] [&>h3]:font-medium [&>h3]:leading-[1.3] [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-6 [&_a]:text-cognac [&_a]:underline [&_a]:decoration-cognac/50 [&_a]:underline-offset-2 [&_em]:italic [&_strong]:font-semibold [&_strong]:text-parchment [&>p:empty]:block [&>p:empty]:h-[1.8em] md:[&>h2]:text-[32px] md:[&>h3]:text-[24px]"
          dangerouslySetInnerHTML={bodyHtmlProp}
        />
      </section>

      {/* SECTION 3.5 — PREV / NEXT POST */}
      {(previous || next) && (
        <section data-bg="aubergine" className="px-5 pb-[60px] md:px-16">
          <div className="mx-auto flex max-w-[720px] items-center justify-between border-t border-cognac/30 pt-8">
            {previous ? (
              <a
                href={`/blog/${previous.slug}`}
                className="text-[13px] font-semibold uppercase tracking-[0.14em] text-cognac transition-opacity duration-300 hover:opacity-70"
              >
                ← Previous
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a
                href={`/blog/${next.slug}`}
                className="text-[13px] font-semibold uppercase tracking-[0.14em] text-cognac transition-opacity duration-300 hover:opacity-70"
              >
                Next →
              </a>
            ) : (
              <span />
            )}
          </div>
        </section>
      )}

      {/* SECTION 4 — SHARE + SOFT CTA */}
      <section data-bg="aubergine" className="px-5 pb-[90px] md:px-16 md:pb-[150px]">
        <div className="mx-auto max-w-[720px] border-t border-cognac/30 pt-8">
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac">
              Share this piece
            </span>
            {shareLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cognac/60 px-4 py-1.5 font-satoshi text-[13px] text-parchment transition-colors duration-300 hover:bg-[rgba(156,107,53,0.14)]"
              >
                {s.label}
              </a>
            ))}
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-full border border-cognac/60 px-4 py-1.5 font-satoshi text-[13px] text-parchment transition-colors duration-300 hover:bg-[rgba(156,107,53,0.14)]"
            >
              {linkCopied ? 'Link copied.' : 'Copy Link'}
            </button>
          </div>

          <a
            href={softCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 font-vollkorn text-lg italic text-parchment transition-colors duration-300 hover:text-cognac md:text-xl"
          >
            If your brand&rsquo;s positioning needs this kind of scrutiny, let&rsquo;s talk
            <span aria-hidden="true" className="text-cognac">→</span>
          </a>
        </div>
      </section>

      {/* SECTION 5 — RECENT POSTS */}
      <section data-bg="bordeaux" className="py-16 text-center md:py-[130px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-16">
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
            className="mb-[60px] inline-block text-[26px] font-medium leading-[1.4] md:text-[52px]"
          >
            Recent Posts.
          </h2>
        </div>

        <div
          ref={strip.stripRef}
          data-hstrip
          onMouseEnter={strip.onMouseEnter}
          onMouseLeave={strip.onMouseLeave}
          onTouchStart={strip.onTouchStart}
          onTouchEnd={strip.onTouchEnd}
          className="flex gap-7 overflow-x-auto px-5 pb-2 md:px-16"
        >
          {[...stripPosts, ...stripPosts].map((p, i) => (
            <BlogCard key={`${p.href}-${i}`} {...p} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
