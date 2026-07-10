'use client'

import { useEffect, useRef, useState } from 'react'

interface DarkeningParagraphProps {
  text: string
}

export default function DarkeningParagraph({ text }: DarkeningParagraphProps) {
  const words = text.split(' ')
  const boxRef = useRef<HTMLDivElement>(null)
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    let ticking = false
    function tick() {
      const box = boxRef.current
      if (box) {
        const rect = box.getBoundingClientRect()
        const startY = window.innerHeight * 0.82
        const range = box.offsetHeight + window.innerHeight * 0.35
        let progress = (startY - rect.top) / range
        progress = Math.max(0, Math.min(1, progress))
        const next = Math.floor(progress * words.length)
        setActiveCount((prev) => (prev !== next ? next : prev))
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
  }, [words.length])

  return (
    <div ref={boxRef} className="font-vollkorn text-[19px] font-medium leading-[1.6] md:text-[26px]">
      {words.map((w, i) => (
        <span
          key={i}
          style={{ opacity: i < activeCount ? 1 : 0.2 }}
          className="transition-opacity duration-[400ms] ease-out"
        >
          {w}{' '}
        </span>
      ))}
    </div>
  )
}
