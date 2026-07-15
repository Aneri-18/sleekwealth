import sanitizeHtml from 'sanitize-html'

const FIGURE_STYLE = 'margin:2.5rem 0;display:flex;flex-direction:column;gap:0.75rem;'
const IMG_STYLE = 'width:100%;height:auto;border-radius:10px;display:block;'
const FIGCAPTION_STYLE =
  'font-family:var(--font-satoshi);font-size:13px;color:rgba(237,232,220,0.6);text-align:center;'

export { FIGURE_STYLE, IMG_STYLE, FIGCAPTION_STYLE }

export const pixieSanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'h2', 'h3', 'strong', 'em', 'a', 'ol', 'ul', 'li', 'figure', 'img', 'figcaption'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    figure: ['style'],
    img: ['src', 'alt', 'width', 'height', 'loading', 'style'],
    figcaption: ['style'],
  },
  allowedSchemes: ['https', 'mailto'],
  allowedSchemesByTag: { img: [] },
  allowedStyles: {
    figure: {
      margin: [/^2\.5rem 0$/],
      display: [/^flex$/],
      'flex-direction': [/^column$/],
      gap: [/^0\.75rem$/],
    },
    img: {
      width: [/^100%$/],
      height: [/^auto$/],
      'border-radius': [/^10px$/],
      display: [/^block$/],
    },
    figcaption: {
      'font-family': [/^var\(--font-satoshi\)$/],
      'font-size': [/^13px$/],
      color: [/^rgba\(\s*237,\s*232,\s*220,\s*0\.6\s*\)$/],
      'text-align': [/^center$/],
    },
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
  disallowedTagsMode: 'discard',
}

/**
 * The live post-detail page runs a scroll-triggered typewriter effect that reads/rewrites
 * `.textContent` on every h2/h3 — any nested markup (bold/italic/links) inside a heading
 * would silently get flattened to plain text the first time that effect fires. Force
 * headings to plain text at save time so the editor can never produce a heading that looks
 * fine in Pixie but degrades the moment it's viewed on the live site.
 */
export function stripHeadingMarkup(html: string): string {
  return html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (_match, tag, attrs, inner) => {
    const text = inner
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()
    return `<${tag}${attrs}>${text}</${tag}>`
  })
}

export function sanitizePostBody(html: string): string {
  return sanitizeHtml(stripHeadingMarkup(html), pixieSanitizeOptions)
}

// The editor's "Alt text*" field is only cosmetically required (a `required` HTML
// attribute doesn't block a programmatic save) — re-check server-side before commit.
export function findFiguresMissingAltText(html: string): number {
  let missing = 0
  const figureRe = /<figure[^>]*>([\s\S]*?)<\/figure>/gi
  let match: RegExpExecArray | null
  while ((match = figureRe.exec(html))) {
    const imgMatch = match[1].match(/<img[^>]*>/i)
    if (!imgMatch) continue
    const altMatch = imgMatch[0].match(/\balt="([^"]*)"/i)
    if (!altMatch || !altMatch[1].trim()) missing++
  }
  return missing
}

export function countFigures(html: string): number {
  return (html.match(/<figure[^>]*>/gi) ?? []).length
}
