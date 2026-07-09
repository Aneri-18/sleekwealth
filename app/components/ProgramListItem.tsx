interface ProgramListItemProps {
  name: string
  description: string
  href?: string
}

export default function ProgramListItem({
  name,
  description,
  href = '#',
}: ProgramListItemProps) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-6 border-b border-cognac/40 px-2 py-6 transition-colors hover:bg-bordeaux/40"
    >
      <span className="font-vollkorn text-2xl text-parchment">{name}</span>
      <span className="flex items-center gap-4">
        <span className="font-satoshi text-body-mobile text-parchment/70">
          {description}
        </span>
        <span className="-translate-x-1.5 text-cognac opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
          →
        </span>
      </span>
    </a>
  )
}
