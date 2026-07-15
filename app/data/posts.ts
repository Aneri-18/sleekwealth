// The four controlled content-category tags. Every post's `category` must be
// exactly one of these — no per-post variants (e.g. no "— Part 2" suffixes).
export const BLOG_CATEGORIES = [
  'The Luxury Spectrum™',
  'Market Intelligence',
  'Brand Diagnosis',
  'Luxury Strategy',
] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]

// URL/slug-safe version of a category name — strips the ™ symbol rather than
// leaving it in a URL, and normalizes to lowercase-hyphenated form.
export function categorySlug(category: BlogCategory): string {
  return category
    .replace(/™/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export interface BlogPost {
  slug: string
  title: string
  subtitle: string
  authorName: string
  authorTitle: string
  category: BlogCategory
  featuredImage: string
  featuredImageWidth: number
  featuredImageHeight: number
  publishedAt: string
  readingTime: number
  bodyHtml: string
  status: 'draft' | 'published'
  // Hand-written on-page subheading — every post currently sets this explicitly.
  // If unset, falls back to the post's own first sentence (see getFirstSentence).
  subheadingOverride?: string
}

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  mdash: '—',
  ndash: '–',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  trade: '™',
  eacute: 'é',
  egrave: 'è',
  euro: '€',
  nbsp: ' ',
  hellip: '…',
  quot: '"',
  apos: "'",
}

// Derives the on-page subheading from the post's own opening line, rather than
// duplicating a hand-written blurb — keeps it truthful to what the post actually opens with.
export function getFirstSentence(bodyHtml: string): string {
  const firstParagraph = bodyHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/)
  if (!firstParagraph) return ''
  const plainText = firstParagraph[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&([a-zA-Z]+);/g, (entity, name) => HTML_ENTITIES[name] ?? entity)
    .trim()
  const sentenceMatch = plainText.match(/^.*?[.!?](?=\s|$)/)
  return sentenceMatch ? sentenceMatch[0].trim() : plainText
}
