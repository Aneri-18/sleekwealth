import Image from 'next/image'

interface BlogCardProps {
  heroImage: string
  title: string
  date: string
  author: string
  readingTime: string
  href?: string
}

export default function BlogCard({
  heroImage,
  title,
  date,
  author,
  readingTime,
  href = '#',
}: BlogCardProps) {
  return (
    <a
      href={href}
      className="group block aspect-[3/4] overflow-hidden rounded-sw bg-bordeaux/20 transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="relative h-3/5 w-full overflow-hidden">
        <Image src={heroImage} alt={title} fill className="object-cover" />
      </div>
      <div className="flex h-2/5 flex-col justify-between p-6">
        <h3 className="font-vollkorn text-xl text-parchment">{title}</h3>
        <div className="flex flex-col gap-1">
          <p className="font-satoshi text-label text-cognac transition-colors duration-300 group-hover:text-[#7A5228]">
            {date} · {readingTime}
          </p>
          <p className="max-h-0 overflow-hidden font-satoshi text-label text-parchment/70 opacity-0 transition-all duration-300 group-hover:max-h-6 group-hover:opacity-100">
            {author}
          </p>
        </div>
      </div>
    </a>
  )
}
