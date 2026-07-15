'use client'

// Downscales large uploads before they hit the Contents API / serverless body-size
// limits — existing site images run multi-MB, base64 inflates ~33% on top of that.
const MAX_EDGE = 2400
const JPEG_QUALITY = 0.9

export async function resizeImageFile(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size < 3 * 1024 * 1024) return file

  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)

  const keepPng = file.type === 'image/png'
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, keepPng ? 'image/png' : 'image/jpeg', keepPng ? undefined : JPEG_QUALITY)
  )
  if (!blob) return file

  const ext = keepPng ? 'png' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}.${ext}`, { type: blob.type })
}
