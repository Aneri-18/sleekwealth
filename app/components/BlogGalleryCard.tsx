'use client'

import Image from 'next/image'
import { useInViewOnce } from '../hooks/useInViewOnce'

interface BlogGalleryCardProps {
  href: string
  image: string
  title: string
  date: string
  read: string
  author: string
  category: string
  ratio: string
  priority?: boolean
}

export default function BlogGalleryCard({
  href,
  image,
  title,
  date,
  read,
  author,
  category,
  ratio,
  priority = false,
}: BlogGalleryCardProps) {
  const { ref, inView } = useInViewOnce<HTMLAnchorElement>()

  return (
    <a
      ref={ref}
      href={href}
      style={{
        aspectRatio: ratio,
        height: 'clamp(280px, 36vw, 420px)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)',
      }}
      className="group relative flex-none overflow-hidden rounded-sw"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 900px) 90vw, 420px"
        priority={priority}
        className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02]"
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-aubergine/55 to-transparent px-5 py-[18px]">
        <span className="font-satoshi text-[13px] text-parchment">
          {date} &middot; {read}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-aubergine/80 to-transparent px-5 pb-5 pt-[22px]">
        <h3 className="font-vollkorn text-[20px] font-medium leading-[1.3] text-parchment md:text-[26px]">
          {title}
        </h3>
        <div className="mt-2.5 flex items-center gap-3 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
          <span className="font-satoshi text-xs text-parchment/85">{author}</span>
          <span className="font-satoshi text-xs text-cognac">{category}</span>
        </div>
      </div>
    </a>
  )
}
