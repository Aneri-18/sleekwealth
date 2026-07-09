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
      className="group flex flex-wrap items-center justify-between gap-4 border-t border-cognac py-8 px-3 transition-colors duration-[400ms] ease-sw hover:bg-[#3a0b14] md:gap-10 md:py-10 md:px-7"
    >
      <div className="flex flex-1 basis-[300px] items-center gap-6">
        <span
          className="inline-block origin-left whitespace-normal font-satoshi text-[21px] font-light leading-[1.2] transition-transform duration-[400ms] ease-sw group-hover:scale-[1.03] md:whitespace-nowrap md:text-[34px]"
        >
          {name}
        </span>
      </div>
      <div className="flex flex-1 basis-[280px] items-center justify-start gap-5">
        <span
          className="inline-block origin-left whitespace-normal font-vollkorn text-base leading-[1.5] text-parchment opacity-85 transition-transform duration-[400ms] ease-sw group-hover:scale-[1.03] md:whitespace-nowrap"
        >
          {description}
        </span>
        <span className="ml-auto -translate-x-2 font-satoshi text-[22px] text-cognac opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          →
        </span>
      </div>
    </a>
  )
}
