import { ImageResponse } from 'next/og'
import fs from 'node:fs'
import path from 'node:path'
import { getPostBySlug } from '../../data/posts-server'

export const runtime = 'nodejs'
export const alt = 'Sleek Wealth'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function readImageAsDataUri(publicPath: string): string | null {
  try {
    const filePath = path.join(process.cwd(), 'public', publicPath)
    const buffer = fs.readFileSync(filePath)
    const ext = path.extname(filePath).slice(1)
    const mime = ext === 'jpg' ? 'jpeg' : ext
    return `data:image/${mime};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  const imageDataUri = post ? readImageAsDataUri(post.featuredImage) : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#120818',
        }}
      >
        {imageDataUri && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageDataUri}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(18,8,24,0.95) 0%, rgba(18,8,24,0.35) 45%, rgba(18,8,24,0.05) 100%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            bottom: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', fontSize: 52, fontWeight: 600, color: '#EDE8DC', lineHeight: 1.15 }}>
            {post?.title ?? 'Sleek Wealth'}
          </div>
          {post?.subtitle && (
            <div style={{ display: 'flex', fontSize: 26, color: 'rgba(237,232,220,0.75)' }}>{post.subtitle}</div>
          )}
          {post?.authorName && (
            <div style={{ display: 'flex', fontSize: 20, fontStyle: 'italic', color: '#9C6B35' }}>
              {post.authorName}
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: 24, right: 30, display: 'flex', fontSize: 16, color: 'rgba(237,232,220,0.5)' }}>
          sleekwealth.com
        </div>
      </div>
    ),
    { ...size }
  )
}
