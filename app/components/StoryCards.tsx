'use client'

import { useEffect, useState } from 'react'

interface StoryCard {
  number: string | number
  title: string
  body: string
}

interface StoryCardsProps {
  cards: StoryCard[]
}

export default function StoryCards({ cards }: StoryCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % cards.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [cards.length])

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + cards.length) % cards.length)
  const goNext = () => setActiveIndex((i) => (i + 1) % cards.length)

  return (
    <div className="w-full">
      <div className="mb-8 flex gap-2">
        {cards.map((card, i) => (
          <div
            key={card.number}
            className="h-1 flex-1 overflow-hidden rounded-full bg-cognac/20"
          >
            <div
              className={`h-full bg-cognac md:w-full ${
                i === activeIndex ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Desktop: static three-up */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        {cards.map((card) => (
          <StoryCardItem key={card.number} card={card} />
        ))}
      </div>

      {/* Mobile: auto-advancing, tappable */}
      <div className="relative md:hidden">
        <button
          type="button"
          aria-label="Previous story"
          onClick={goPrev}
          className="absolute inset-y-0 left-0 z-10 w-1/2"
        />
        <button
          type="button"
          aria-label="Next story"
          onClick={goNext}
          className="absolute inset-y-0 right-0 z-10 w-1/2"
        />
        <StoryCardItem card={cards[activeIndex]} />
      </div>
    </div>
  )
}

function StoryCardItem({ card }: { card: StoryCard }) {
  return (
    <div className="rounded-sw border border-cognac/30 bg-bordeaux/20 p-8">
      <span className="font-satoshi text-label text-cognac">
        {card.number}
      </span>
      <h3 className="mt-4 font-vollkorn text-2xl text-parchment">
        {card.title}
      </h3>
      <p className="mt-4 font-satoshi text-body-mobile text-parchment/80">
        {card.body}
      </p>
    </div>
  )
}
