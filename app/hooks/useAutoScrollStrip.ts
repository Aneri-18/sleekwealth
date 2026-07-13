'use client'

import { useEffect, useRef } from 'react'

export function useAutoScrollStrip<T extends HTMLElement>() {
  const stripRef = useRef<T>(null)
  const pausedRef = useRef(false)
  const stripPosRef = useRef(0)

  useEffect(() => {
    let raf: number
    function loop() {
      const s = stripRef.current
      if (s && !pausedRef.current) {
        // The strip renders its card set twice back-to-back, so wrapping at the
        // halfway point lands on an identical copy — the loop is seamless, no snap.
        const setWidth = s.scrollWidth / 2
        stripPosRef.current += 0.4
        if (stripPosRef.current >= setWidth) stripPosRef.current -= setWidth
        s.scrollLeft = stripPosRef.current
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pause = () => {
    pausedRef.current = true
  }
  const resume = () => {
    // Resync to wherever the user actually left it (manual scroll/touch drag)
    // before resuming, otherwise the strip snaps back to the pre-pause position.
    const s = stripRef.current
    if (s) stripPosRef.current = s.scrollLeft
    pausedRef.current = false
  }

  return {
    stripRef,
    onMouseEnter: pause,
    onMouseLeave: resume,
    onTouchStart: pause,
    onTouchEnd: resume,
  }
}
