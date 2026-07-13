'use client'

import { useEffect, useRef, useState } from 'react'

interface OutcomesSectionProps {
  label: string
  outcomes: string[]
}

export default function OutcomesSection({ label, outcomes }: OutcomesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const [active, setActive] = useState(0)
  const [labelY, setLabelY] = useState(0)

  useEffect(() => {
    let ticking = false
    function tick() {
      const sec = sectionRef.current
      if (sec) {
        const r = sec.getBoundingClientRect()
        const scrollable = sec.offsetHeight - window.innerHeight
        let progress = scrollable > 0 ? -r.top / scrollable : 0
        progress = Math.max(0, Math.min(0.9999, progress))
        const next = Math.min(outcomes.length - 1, Math.floor(progress * outcomes.length))
        setActive((prev) => (prev !== next ? next : prev))

        const row = rowRef.current
        const label = labelRef.current
        const item = itemRefs.current[next]
        if (window.innerWidth >= 900 && row && label && item) {
          const rowRect = row.getBoundingClientRect()
          const itemRect = item.getBoundingClientRect()
          const y = itemRect.top - rowRect.top + itemRect.height / 2 - label.offsetHeight / 2
          setLabelY((prev) => (Math.abs(prev - y) > 0.5 ? y : prev))
        } else {
          setLabelY(0)
        }
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
  }, [outcomes.length])

  return (
    <section
      ref={sectionRef}
      data-bg="aubergine"
      className="relative"
      style={{ height: `${outcomes.length * 40 + 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center px-5 md:px-16">
        <div
          ref={rowRef}
          className="mx-auto grid w-full max-w-[1200px] items-start gap-8 md:grid-cols-[0.6fr_1fr] md:gap-[90px]"
        >
          <div
            ref={labelRef}
            style={{ transform: `translateY(${labelY}px)`, transition: 'transform 300ms ease-sw' }}
          >
            <span className="text-sm leading-[1.7] tracking-[0.04em] text-cognac">{label}</span>
          </div>
          <div className="flex flex-col gap-5 md:gap-10">
            {outcomes.map((line, i) => (
              <div
                key={line}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                style={{
                  opacity: i === active ? 1 : 0.15,
                  transform: i === active ? 'translateX(0)' : 'translateX(-6px)',
                }}
                className="whitespace-normal font-vollkorn text-[22px] font-medium leading-[1.3] text-parchment transition-[opacity,transform] duration-300 ease-sw md:whitespace-nowrap md:text-[36px]"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
