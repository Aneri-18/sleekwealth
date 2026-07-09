interface StoryCard {
  num: string
  title: string
  body: string
}

interface StoryCardsProps {
  cards: StoryCard[]
}

export default function StoryCards({ cards }: StoryCardsProps) {
  return (
    <div className="flex flex-wrap gap-6">
      {cards.map((card, i) => (
        <div
          key={card.num}
          className="group flex flex-1 basis-[280px] flex-col rounded-sw border border-cognac px-7 pb-[34px] pt-[26px] transition-[transform,border-color,background-color] duration-500 ease-sw hover:-translate-y-1.5 hover:border-[#c98a4a] hover:bg-[rgba(156,107,53,0.06)]"
          style={{ minHeight: 'clamp(240px, 32vh, 300px)' }}
        >
          <div className="mb-[26px] flex gap-1.5">
            {[0, 1, 2].map((barIndex) => (
              <span
                key={barIndex}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-parchment/[0.22]"
              >
                <span
                  className="block h-full origin-left bg-cognac"
                  style={{ transform: `scaleX(${barIndex <= i ? 1 : 0})` }}
                />
              </span>
            ))}
          </div>
          <div className="mb-4 font-satoshi text-[13px] tracking-[0.16em] text-cognac">
            {card.num}
          </div>
          <h3 className="mb-4 font-vollkorn text-[28px] leading-[1.3] text-parchment md:text-[38px]">
            {card.title}
          </h3>
          <p className="font-satoshi text-base leading-[1.7] text-parchment opacity-90">
            {card.body}
          </p>
        </div>
      ))}
    </div>
  )
}
