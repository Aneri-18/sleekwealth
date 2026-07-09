'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface ExpandingContainerProps {
  imageSrc?: string
  videoSrc?: string
  alt?: string
  className?: string
}

export default function ExpandingContainer({
  imageSrc,
  videoSrc,
  alt = '',
  className = '',
}: ExpandingContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Structure only — ranges are identity placeholders until the real
  // expand/contract curve is designed.
  const containerScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 1])
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '0%'])

  return (
    <motion.div
      ref={containerRef}
      style={{ scale: containerScale }}
      className={`relative overflow-hidden rounded-sw ${className}`}
    >
      <motion.div style={{ y: mediaY }} className="absolute inset-0">
        {videoSrc ? (
          <video
            src={videoSrc}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
          />
        ) : imageSrc ? (
          <Image src={imageSrc} alt={alt} fill className="object-cover" />
        ) : null}
      </motion.div>
    </motion.div>
  )
}
