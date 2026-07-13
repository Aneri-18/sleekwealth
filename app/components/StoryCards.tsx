'use client'

import { useEffect, useRef, useState } from 'react'

interface StoryCard {
  num: string
  title: string
  body: string
}

interface StoryCardsProps {
  cards: StoryCard[]
}

const STORY_DURATION = 4500

export default function StoryCards({ cards }: StoryCardsProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)
  const startRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)')
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    startRef.current = performance.now()
    setProgress(0)

    function tick(now: number) {
      const elapsed = now - startRef.current
      const p = Math.min(1, elapsed / STORY_DURATION)
      setProgress(p)
      if (p >= 1) {
        setActive((v) => (v + 1) % cards.length)
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isMobile, active, cards.length])

  function goTo(i: number) {
    setActive((i + cards.length) % cards.length)
  }

  if (!isMobile) {
    return (
      <div className="flex flex-wrap gap-6">
        {cards.map((card, i) => (
          <div
            key={card.num}
            className="group flex flex-1 basis-[280px] flex-col rounded-sw border border-cognac px-7 pb-[34px] pt-[26px] transition-[transform,border-color,background-color] duration-500 ease-sw hover:-translate-y-1.5 hover:border-[#c98a4a] hover:bg-[rgba(156,107,53,0.06)]"
            style={{ minHeight: 'clamp(240px, 32vh, 300px)' }}
          >
            <div className="mb-[26px] flex gap-1.5">
              {cards.map((_, barIndex) => (
                <span
                  key={barIndex}
                  className="h-[3px] flex-1 overflow-hidden rounded-full bg-parchment/[0.22]"
                >
                  <span
                    className="block h-full origin-left bg-cognac"
                    style={{ transform: `scaleX(${barIndex <= i ? 1 : 0})` }}
                  />
                </span>
              ))}
            </div>
            <div className="mb-4 font-satoshi text-[13px] tracking-[0.16em] text-cognac">
              {card.num}
            </div>
            <h3 className="mb-4 font-vollkorn text-[28px] leading-[1.3] text-parchment md:text-[38px]">
              {card.title}
            </h3>
            <p className="font-satoshi text-base leading-[1.7] text-parchment opacity-90">
              {card.body}
            </p>
          </div>
        ))}
      </div>
    )
  }

  const card = cards[active]

  return (
    <div
      className="relative flex select-none flex-col overflow-hidden rounded-sw border border-cognac px-7 pb-[34px] pt-[26px]"
      style={{ minHeight: 'clamp(240px, 45vh, 340px)' }}
    >
      <div className="mb-[26px] flex gap-1.5">
        {cards.map((_, i) => (
          <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-parchment/[0.22]">
            <span
              className="block h-full origin-left bg-cognac"
              style={{
                transform: `scaleX(${i < active ? 1 : i === active ? progress : 0})`,
                transition: i === active ? 'none' : 'transform 200ms ease',
              }}
            />
          </span>
        ))}
      </div>
      <div className="mb-4 font-satoshi text-[13px] tracking-[0.16em] text-cognac">{card.num}</div>
      <h3 className="mb-4 font-vollkorn text-[28px] leading-[1.3] text-parchment">{card.title}</h3>
      <p className="font-satoshi text-base leading-[1.7] text-parchment opacity-90">{card.body}</p>

      <button
        type="button"
        aria-label="Previous step"
        onClick={() => goTo(active - 1)}
        className="absolute inset-y-0 left-0 w-1/3"
      />
      <button
        type="button"
        aria-label="Next step"
        onClick={() => goTo(active + 1)}
        className="absolute inset-y-0 right-0 w-2/3"
      />
    </div>
  )
}
