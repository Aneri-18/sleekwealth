import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { FigureBlockView } from './FigureBlockView'
import { FIGURE_STYLE, IMG_STYLE, FIGCAPTION_STYLE } from '../sanitize'

export interface FigureBlockAttrs {
  src: string | null
  alt: string
  caption: string
  width: number | null
  height: number | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figureBlock: {
      insertFigureBlock: (attrs: Partial<FigureBlockAttrs>) => ReturnType
    }
  }
}

export interface UploadedImage {
  src: string
  width: number
  height: number
}

export interface FigureBlockOptions {
  uploadImage: (file: File) => Promise<UploadedImage>
}

export const FigureBlock = Node.create<FigureBlockOptions>({
  name: 'figureBlock',
  group: 'block',
  atom: true,
  draggable: true,
  isolating: true,

  addOptions() {
    return {
      uploadImage: async () => {
        throw new Error('uploadImage was not configured')
      },
    }
  },

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
      width: { default: null },
      height: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false
          const img = el.querySelector('img')
          if (!img) return false
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') ?? '',
            width: img.getAttribute('width') ? Number(img.getAttribute('width')) : null,
            height: img.getAttribute('height') ? Number(img.getAttribute('height')) : null,
            caption: el.querySelector('figcaption')?.textContent ?? '',
          }
        },
      },
    ]
  },

  renderHTML({ node }) {
    const { src, alt, caption, width, height } = node.attrs as FigureBlockAttrs
    return [
      'figure',
      mergeAttributes({ style: FIGURE_STYLE }),
      [
        'img',
        {
          src,
          alt,
          width,
          height,
          loading: 'lazy',
          style: IMG_STYLE,
        },
      ],
      ['figcaption', { style: FIGCAPTION_STYLE }, caption || ''],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureBlockView)
  },

  addCommands() {
    return {
      insertFigureBlock:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    }
  },
})
