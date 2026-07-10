'use client'

import { useState } from 'react'

interface StackProgram {
  name: string
  href: string
}

interface ProgramStackProps {
  programs: StackProgram[]
}

export default function ProgramStack({ programs }: ProgramStackProps) {
  const [active, setActive] = useState(0)
  const n = programs.length

  const prev = () => setActive((v) => (v - 1 + n) % n)
  const next = () => setActive((v) => (v + 1) % n)

  return (
    <div className="mx-auto text-center">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px]">
        {programs.map((p, idx) => {
          let off = idx - active
          const half = n / 2
          while (off > half) off -= n
          while (off <= -half) off += n
          const abs = Math.abs(off)
          const sign = off < 0 ? -1 : 1

          let tx = '-50%'
          let scale = 1
          let opacity = 1
          let z = 5
          let pe: 'auto' | 'none' = 'auto'
          if (abs === 0) {
            tx = '-50%'
            scale = 1
            opacity = 1
            z = 5
          } else if (abs === 1) {
            tx = `calc(-50% + ${sign * 58}%)`
            scale = 0.85
            opacity = 0.55
            z = 4
          } else if (abs === 2) {
            tx = `calc(-50% + ${sign * 98}%)`
            scale = 0.7
            opacity = 0.22
            z = 3
          } else {
            tx = `calc(-50% + ${sign * 130}%)`
            scale = 0.6
            opacity = 0
            z = 2
            pe = 'none'
          }

          return (
            <a
              key={p.name}
              href={p.href}
              style={{
                transform: `translateX(${tx}) scale(${scale})`,
                opacity,
                zIndex: z,
                pointerEvents: pe,
              }}
              className="absolute top-0 left-1/2 flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-sw bg-[repeating-linear-gradient(45deg,#1c0f24,#1c0f24_11px,#160b1d_11px,#160b1d_22px)] transition-[transform,opacity] duration-[550ms] ease-sw will-change-transform"
            >
              <span className="font-satoshi text-[11px] uppercase tracking-[0.12em] text-cognac">
                Case study
              </span>
            </a>
          )
        })}
      </div>

      <div className="mt-9 flex items-center justify-center gap-7">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous program"
          className="p-2 text-cognac opacity-70 transition-opacity duration-[250ms] ease-out hover:opacity-100"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path d="M8 1L1 7L8 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="min-w-[200px] font-vollkorn text-[20px] font-medium text-parchment md:text-[26px]">
          {programs[active]?.name}
        </span>
        <button
          type="button"
          onClick={next}
          aria-label="Next program"
          className="p-2 text-cognac opacity-70 transition-opacity duration-[250ms] ease-out hover:opacity-100"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path d="M1 1L8 7L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
