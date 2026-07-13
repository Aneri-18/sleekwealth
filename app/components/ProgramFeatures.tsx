'use client'

import { useState } from 'react'

interface Feature {
  name: string
  line: string
}

interface ProgramFeaturesProps {
  features: Feature[]
}

export default function ProgramFeatures({ features }: ProgramFeaturesProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[0.5fr_1fr] md:gap-[90px]">
      <div className="flex flex-col gap-3.5">
        <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cognac">
          Program Features
        </span>
        <span className="font-vollkorn text-[70px] font-medium leading-none text-cognac transition-opacity duration-300 ease-out md:text-[150px]">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {features.map((f, i) => (
          <div
            key={f.name}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(i)}
            className="cursor-default rounded-sw border border-cognac px-[22px] py-[26px] transition-[transform,border-color,background-color] duration-[400ms] ease-sw hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[#c98a4a] hover:bg-[rgba(156,107,53,0.06)] md:px-8 md:py-[30px]"
          >
            <div className="mb-2 font-vollkorn text-[22px] font-medium leading-[1.3] md:text-[30px]">
              {f.name}
            </div>
            <div className="text-[15px] leading-[1.6] text-parchment opacity-80">{f.line}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
