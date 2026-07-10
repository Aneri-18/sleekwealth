'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface ExpandingContainerProps {
  imageSrc?: string
  videoSrc?: string
  alt?: string
  placeholderLabel?: string
}

export default function ExpandingContainer({
  imageSrc,
  videoSrc,
  alt = '',
  placeholderLabel,
}: ExpandingContainerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    function tick() {
      const el = wrapperRef.current
      if (el) {
        const r = el.getBoundingClientRect()
        const p = Math.max(0, Math.min(1, 1 - r.top / window.innerHeight))
        setProgress(p)
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

  const width = 60 + progress * 32 // 60% -> 92%
  const parallaxY = (progress - 0.5) * -60 // px

  const hasAsset = Boolean(imageSrc || videoSrc)

  return (
    <div ref={wrapperRef} className="flex justify-center">
      <div
        className="aspect-[3/4] overflow-hidden rounded-sw transition-[width] duration-[250ms] ease-out md:aspect-[16/9]"
        style={{ width: `${width}%`, maxWidth: 1200 }}
      >
        <div
          className="relative flex h-[130%] w-full items-center justify-center bg-[repeating-linear-gradient(45deg,#1c0f24,#1c0f24_11px,#160b1d_11px,#160b1d_22px)]"
          style={{ marginTop: '-15%', transform: `translateY(${parallaxY}px)` }}
        >
          {videoSrc ? (
            <video
              src={videoSrc}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              playsInline
            />
          ) : imageSrc ? (
            <Image src={imageSrc} alt={alt} fill sizes="92vw" className="object-cover" />
          ) : null}
          {!hasAsset && placeholderLabel && (
            <span className="relative px-8 text-center font-satoshi text-xs uppercase tracking-[0.14em] text-cognac">
              {placeholderLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
