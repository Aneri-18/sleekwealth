'use client'

import { useRef, useState } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import type { FigureBlockOptions } from './FigureBlock'

export function FigureBlockView({ node, updateAttributes, deleteNode, extension }: NodeViewProps) {
  const { src, alt, caption } = node.attrs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { uploadImage } = extension.options as FigureBlockOptions
      const result = await uploadImage(file)
      updateAttributes({ src: result.src, width: result.width, height: result.height })
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <NodeViewWrapper className="pixie-figure-block my-6" data-drag-handle>
      <div className="space-y-3 rounded-sw border border-cognac/30 p-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-[140px] w-full items-center justify-center overflow-hidden rounded-sw bg-[repeating-linear-gradient(45deg,#3a0b14,#3a0b14_11px,#320a12_11px,#320a12_22px)]"
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-satoshi text-[11px] uppercase tracking-[0.12em] text-cognac">
              {uploading ? 'Uploading…' : 'Click to upload image'}
            </span>
          )}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          <label className="block text-left">
            <span className="mb-1 block text-[10px] text-parchment/60">
              Alt text <span className="text-cognac">*</span>
            </span>
            <input
              value={alt}
              onChange={(e) => updateAttributes({ alt: e.target.value })}
              placeholder="Describe the image plainly"
              className="w-full rounded-md border border-cognac/30 bg-transparent px-2 py-1.5 font-satoshi text-xs text-parchment outline-none focus:border-cognac"
            />
          </label>
          <label className="block text-left">
            <span className="mb-1 block text-[10px] text-parchment/60">Caption (optional)</span>
            <input
              value={caption}
              onChange={(e) => updateAttributes({ caption: e.target.value })}
              placeholder="Your editorial line, if it adds something"
              className="w-full rounded-md border border-cognac/30 bg-transparent px-2 py-1.5 font-satoshi text-xs text-parchment outline-none focus:border-cognac"
            />
          </label>
        </div>

        <button type="button" onClick={() => deleteNode()} className="text-xs text-red-400 hover:text-red-300">
          Remove
        </button>
      </div>
    </NodeViewWrapper>
  )
}
