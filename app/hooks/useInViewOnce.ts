'use client'

import { useEffect, useRef, useState } from 'react'

export function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, inView }
}
