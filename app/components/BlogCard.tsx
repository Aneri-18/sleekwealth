import Image from 'next/image'

interface BlogCardProps {
  title: string
  author: string
  read: string
  offset: string
  href?: string
  image?: string
}

export default function BlogCard({
  title,
  author,
  read,
  offset,
  href = '#',
  image,
}: BlogCardProps) {
  return (
    <a
      href={href}
      style={{ marginTop: offset, width: 'clamp(168px, 24vw, 300px)' }}
      className="group flex shrink-0 flex-col transition-transform duration-[400ms] ease-out hover:scale-[1.02]"
    >
      <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-sw bg-[repeating-linear-gradient(45deg,#3a0b14,#3a0b14_11px,#320a12_11px,#320a12_22px)]">
        {image ? (
          <Image src={image} alt="" fill unoptimized className="object-cover" />
        ) : (
          <span className="font-satoshi text-[11px] uppercase tracking-[0.12em] text-cognac">
            Blog hero
          </span>
        )}
      </div>
      <div className="pt-5">
        <h3 className="font-vollkorn text-[22px] leading-[1.35] text-parchment">{title}</h3>
        <div className="mt-3 flex items-center gap-3.5 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
          <span className="font-satoshi text-[13px] text-parchment/85">{author}</span>
          <span className="font-satoshi text-[13px] text-cognac">{read}</span>
        </div>
      </div>
    </a>
  )
}
