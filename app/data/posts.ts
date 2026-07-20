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
  // Manually written by Aneri — doubles as the on-page subheading shown beneath
  // the title and the SEO/OG description. No auto-generated fallback.
  subtitle: string
  authorName: string
  authorTitle: string
  category: BlogCategory
  featuredImage: string
  featuredImageWidth: number
  featuredImageHeight: number
  featuredImageAlt?: string
  featuredImageCaption?: string
  publishedAt: string
  // Set automatically on every Pixie save (draft or publish) — absent on posts
  // migrated before this field existed, until they're next saved.
  updatedAt?: string
  readingTime: number
  bodyHtml: string
  status: 'draft' | 'published'
}
