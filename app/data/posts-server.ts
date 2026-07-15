// Server-only: reads content/blog/*.md from disk via `fs`. Never import this
// from a 'use client' component — its module body would try to bundle `fs`
// for the browser and fail. Client components receive this data as props
// from their server-component `page.tsx` instead.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { cache } from 'react'
import type { BlogPost } from './posts'

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

const loadAllPosts = cache((): BlogPost[] => {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    return { ...(data as Omit<BlogPost, 'bodyHtml'>), bodyHtml: content.trim() }
  })
})

export function getAllPosts(): BlogPost[] {
  return loadAllPosts()
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return loadAllPosts().find((p) => p.slug === slug && p.status === 'published')
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, count)
}

export interface AdjacentPosts {
  previous: BlogPost | null
  next: BlogPost | null
}

// Chronological order (oldest first) — "previous" is the post published just
// before this one, "next" is the one published just after.
export function getAdjacentPosts(slug: string): AdjacentPosts {
  const chronological = [...getAllPosts()].reverse()
  const index = chronological.findIndex((p) => p.slug === slug)
  if (index === -1) return { previous: null, next: null }
  return {
    previous: index > 0 ? chronological[index - 1] : null,
    next: index < chronological.length - 1 ? chronological[index + 1] : null,
  }
}

export interface NavPost {
  title: string
  href: string
  image: string
}

export function getNavPosts(count = 3): NavPost[] {
  return getAllPosts()
    .slice(0, count)
    .map((p) => ({ title: p.title, href: `/blog/${p.slug}`, image: p.featuredImage }))
}

export interface BlogStripCard {
  title: string
  author: string
  read: string
  offset: string
  href: string
  image?: string
}

const STRIP_OFFSETS = ['0px', '48px', '16px', '56px']

// The strip always shows exactly `count` newest posts — it's a teaser, not the archive
// (that's /blog), so it neither shrinks awkwardly nor grows unbounded as posts publish.
// Pad with "see more" filler cards (no fabricated posts) until there's enough real+filler
// width to scroll; fillers disappear on their own once enough real posts exist.
export function getBlogStripCards(count = 7, excludeSlug?: string): BlogStripCard[] {
  const cards: BlogStripCard[] = getAllPosts()
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, count)
    .map((p, i) => ({
      title: p.title,
      author: p.authorName,
      read: `${p.readingTime} min`,
      offset: STRIP_OFFSETS[i % STRIP_OFFSETS.length],
      href: `/blog/${p.slug}`,
      image: p.featuredImage,
    }))
  let fillerN = 0
  while (cards.length < count) {
    cards.push({
      title: 'More from the Blog.',
      author: 'Sleek Wealth',
      read: '',
      offset: STRIP_OFFSETS[cards.length % STRIP_OFFSETS.length],
      href: `/blog#more-${fillerN++}`,
    })
  }
  return cards
}
