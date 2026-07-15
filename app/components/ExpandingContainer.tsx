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
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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

  const scale = 60 / 92 + progress * (1 - 60 / 92) // ~0.652 -> 1
  const parallaxY = (progress - 0.5) * -60 // px

  const hasAsset = Boolean(imageSrc || videoSrc)

  return (
    <div ref={wrapperRef} className="flex w-full justify-center">
      <div
        className="overflow-hidden rounded-sw transition-[transform] duration-[250ms] ease-out"
        style={{
          width: '92%',
          maxWidth: 1200,
          aspectRatio: isDesktop ? '16/9' : '3/4',
          transform: `scale(${scale})`,
        }}
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
            <Image src={imageSrc} alt={alt} fill unoptimized className="object-cover" />
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
