'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FigureBlock, type UploadedImage } from '../lib/pixie/tiptap/FigureBlock'
import { BLOG_CATEGORIES, type BlogCategory, type BlogPost } from '../data/posts'
import { slugify } from '../lib/pixie/slugify'
import { resizeImageFile } from '../lib/pixie/resize-image'

const MAX_FIGURES = 5

interface PixieEditorProps {
  initialPost?: BlogPost
}

async function uploadToServer(file: File, slug: string): Promise<UploadedImage> {
  const resized = await resizeImageFile(file)
  const formData = new FormData()
  formData.append('file', resized)
  formData.append('slug', slug)
  const res = await fetch('/api/pixie/images', { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

export default function PixieEditor({ initialPost }: PixieEditorProps) {
  const router = useRouter()
  const isNew = !initialPost

  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [slug, setSlug] = useState(initialPost?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(!isNew)
  const [subtitle, setSubtitle] = useState(initialPost?.subtitle ?? '')
  const [authorName, setAuthorName] = useState(initialPost?.authorName ?? 'Aneri Shah')
  const [authorTitle, setAuthorTitle] = useState(initialPost?.authorTitle ?? 'Founder, Sleek Wealth')
  const [category, setCategory] = useState<BlogCategory>(initialPost?.category ?? BLOG_CATEGORIES[0])
  const [subheadingOverride, setSubheadingOverride] = useState(initialPost?.subheadingOverride ?? '')
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featuredImage ?? '')
  const [featuredImageWidth, setFeaturedImageWidth] = useState(initialPost?.featuredImageWidth ?? 0)
  const [featuredImageHeight, setFeaturedImageHeight] = useState(initialPost?.featuredImageHeight ?? 0)
  const [savingStatus, setSavingStatus] = useState<'draft' | 'published' | null>(null)
  const [statusNote, setStatusNote] = useState('')
  const [error, setError] = useState('')
  const featuredInputRef = useRef<HTMLInputElement>(null)

  const effectiveSlug = slugEdited ? slug : slugify(title)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugEdited) setSlug(slugify(value))
  }

  const uploadImage = useMemo(
    () => (file: File) => uploadToServer(file, effectiveSlug || 'untitled'),
    [effectiveSlug]
  )

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // TipTap v3's StarterKit bundles underline/strike/blockquote/code/codeBlock/horizontalRule
      // by default — disabled here because the live site's sanitize-html allowlist and its
      // Tailwind typography rules only support the tags below; leaving the extras enabled would
      // let the editor accept formatting that silently vanishes (or renders unstyled) on save.
      StarterKit.configure({
        heading: { levels: [2, 3] },
        underline: false,
        strike: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      FigureBlock.configure({ uploadImage }),
    ],
    content: initialPost?.bodyHtml ?? '',
  })

  async function handleFeaturedImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const result = await uploadToServer(file, effectiveSlug || 'untitled')
      setFeaturedImage(result.src)
      setFeaturedImageWidth(result.width)
      setFeaturedImageHeight(result.height)
    } catch {
      setError('Featured image upload failed')
    }
  }

  function insertFigureBlock() {
    if (!editor) return
    let count = 0
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'figureBlock') count++
    })
    if (count >= MAX_FIGURES) {
      setError(`You can only have ${MAX_FIGURES} images in the body`)
      return
    }
    editor.chain().focus().insertFigureBlock({ src: null, alt: '', caption: '' }).run()
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!editor) return
    setError('')
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!effectiveSlug) {
      setError('Slug is required')
      return
    }
    setSavingStatus(status)
    try {
      const res = await fetch('/api/pixie/posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: effectiveSlug,
          title,
          subtitle,
          authorName,
          authorTitle,
          category,
          featuredImage,
          featuredImageWidth,
          featuredImageHeight,
          publishedAt: initialPost?.publishedAt,
          subheadingOverride,
          status,
          bodyHtml: editor.getHTML(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Save failed')
        setSavingStatus(null)
        return
      }
      setStatusNote(status === 'published' ? 'Published.' : 'Draft saved.')
      if (isNew) {
        router.push(`/pixie/${effectiveSlug}/edit`)
      } else {
        router.refresh()
      }
    } catch {
      setError('Save failed')
    } finally {
      setSavingStatus(null)
    }
  }

  return (
    <div className="min-h-screen bg-aubergine px-5 py-14 text-parchment md:px-16">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-7 flex items-center justify-between">
          <span className="font-satoshi text-xs text-parchment/60">{statusNote}</span>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={savingStatus !== null}
              className="rounded-[999px] border border-cognac/60 px-5 py-2.5 font-satoshi text-sm text-parchment transition-colors duration-300 hover:bg-[rgba(156,107,53,0.14)] disabled:opacity-60"
            >
              {savingStatus === 'draft' ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={savingStatus !== null}
              className="rounded-[999px] border border-cognac bg-cognac px-5 py-2.5 font-satoshi text-sm font-semibold text-aubergine transition-colors duration-300 hover:bg-[#b17d47] disabled:opacity-60"
            >
              {savingStatus === 'published' ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 font-satoshi text-sm text-red-400">{error}</p>}

        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          className="mb-1.5 w-full bg-transparent font-vollkorn text-[34px] font-medium text-parchment outline-none placeholder:text-parchment/30"
        />
        <div className="mb-6 font-satoshi text-xs text-parchment/60">
          sleekwealth.com/blog/
          <input
            value={effectiveSlug}
            onChange={(e) => {
              setSlugEdited(true)
              setSlug(slugify(e.target.value))
            }}
            className="w-auto min-w-[80px] bg-transparent text-cognac outline-none"
            style={{ width: `${Math.max(effectiveSlug.length, 4)}ch` }}
          />
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block font-satoshi text-xs text-parchment/60">Subtitle</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-sw border border-cognac/30 bg-transparent px-3.5 py-2.5 font-satoshi text-sm text-parchment outline-none focus:border-cognac"
          />
        </label>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block font-satoshi text-xs text-parchment/60">Author Name</span>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full rounded-sw border border-cognac/30 bg-transparent px-3.5 py-2.5 font-satoshi text-sm text-parchment outline-none focus:border-cognac"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-satoshi text-xs text-parchment/60">Author Title</span>
            <input
              value={authorTitle}
              onChange={(e) => setAuthorTitle(e.target.value)}
              className="w-full rounded-sw border border-cognac/30 bg-transparent px-3.5 py-2.5 font-satoshi text-sm text-parchment outline-none focus:border-cognac"
            />
          </label>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block font-satoshi text-xs text-parchment/60">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogCategory)}
              className="w-full rounded-sw border border-cognac/30 bg-aubergine px-3.5 py-2.5 font-satoshi text-sm text-parchment outline-none focus:border-cognac"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block font-satoshi text-xs text-parchment/60">Subheading (optional override)</span>
            <input
              value={subheadingOverride}
              onChange={(e) => setSubheadingOverride(e.target.value)}
              placeholder="Defaults to the post's first sentence"
              className="w-full rounded-sw border border-cognac/30 bg-transparent px-3.5 py-2.5 font-satoshi text-sm text-parchment outline-none placeholder:text-parchment/30 focus:border-cognac"
            />
          </label>
        </div>

        <div className="mb-6">
          <span className="mb-1.5 block font-satoshi text-xs text-parchment/60">Featured Image</span>
          <button
            type="button"
            onClick={() => featuredInputRef.current?.click()}
            className="flex w-full items-center justify-center overflow-hidden rounded-sw border border-dashed border-cognac/40 bg-[repeating-linear-gradient(45deg,#1c0f24,#1c0f24_11px,#160b1d_11px,#160b1d_22px)] py-9 text-center font-satoshi text-[13px] text-parchment/60 transition-colors hover:border-cognac"
          >
            {featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featuredImage} alt="" className="max-h-[180px] rounded-sw" />
            ) : (
              'Drop an image here, or click to upload — used as the blog card preview and social share background'
            )}
          </button>
          <input ref={featuredInputRef} type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageChange} />
        </div>

        <span className="mb-1.5 block font-satoshi text-xs text-parchment/60">Body</span>
        <div className="mb-1.5 flex flex-wrap gap-1 rounded-t-sw border border-b-0 border-cognac/30 p-2">
          <ToolbarButton label="B" title="Bold" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} />
          <ToolbarButton label="I" title="Italic" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} />
          <Separator />
          <ToolbarButton label="H2" title="Heading 2" active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
          <ToolbarButton label="H3" title="Heading 3" active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} />
          <Separator />
          <ToolbarButton label="•—" title="Bullet list" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
          <ToolbarButton label="1." title="Numbered list" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
          <ToolbarButton
            label="🔗"
            title="Link"
            active={editor?.isActive('link')}
            onClick={() => {
              const url = window.prompt('URL')
              if (url) editor?.chain().focus().setLink({ href: url }).run()
              else editor?.chain().focus().unsetLink().run()
            }}
          />
          <Separator />
          <ToolbarButton label="🖼" title="Insert image block" onClick={insertFigureBlock} />
        </div>
        <div className="rounded-b-sw border border-cognac/30 p-5">
          <EditorContent
            editor={editor}
            className="prose-pixie min-h-[260px] font-satoshi text-[15px] leading-[1.7] text-parchment [&_h2]:font-vollkorn [&_h2]:text-[22px] [&_h2]:font-semibold [&_h3]:font-vollkorn [&_h3]:text-[19px] [&_h3]:font-semibold [&_p]:mb-4 [&_p]:text-parchment/85 [&_.ProseMirror]:outline-none"
          />
        </div>

        <div className="mt-9 rounded-sw border border-cognac/30 px-5 py-4 font-satoshi text-xs text-parchment/60">
          <b className="text-parchment">Note:</b> this editor writes in the same HTML structure as your published
          posts, so spacing, image padding, and heading rules from the live site apply automatically.
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  label,
  title,
  active,
  onClick,
}: {
  label: string
  title: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md font-satoshi text-[13px] transition-colors ${
        active ? 'bg-[rgba(156,107,53,0.25)] text-parchment' : 'text-parchment/70 hover:bg-[rgba(156,107,53,0.14)]'
      }`}
    >
      {label}
    </button>
  )
}

function Separator() {
  return <div className="mx-1 w-px self-stretch bg-cognac/30" />
}
