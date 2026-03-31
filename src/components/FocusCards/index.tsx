'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Bookmark, PlayCircle, Star } from 'lucide-react'
import { Button } from '../ui/button'

type Card = {
  title: string
  image: string
  overview: string
  vote_average: number
  category: 'movie' | 'series'
  genre_ids: number[]
  id: number
}

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    type,
    isRecommendationPanel = false,
    handleCardClick,
  }: {
    card: Card
    index: number
    hovered: number | null
    type?: 'full' | 'six-per-row'
    setHovered: React.Dispatch<React.SetStateAction<number | null>>
    isRecommendationPanel?: boolean
    handleCardClick?: () => void
  }) => {
    return (
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          'rounded-xl relative bg-neutral-950 overflow-hidden transition-all duration-300 ease-out',
          type === 'full' ? 'h-180' : 'h-60 md:h-96',
          hovered !== null && hovered !== index && 'opacity-40 scale-[0.98]',
          hovered === index && !isRecommendationPanel && 'scale-[1.01]',
        )}
      >
        <img
          src={card.image}
          alt={card.title}
          className="object-cover absolute inset-0 w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: hovered === index && !isRecommendationPanel ? 'scale(1.04)' : 'scale(1)' }}
        />

        {/* Base gradient always visible for hero cards */}
        {isRecommendationPanel && (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 100%)',
            }}
          />
        )}

        {/* Hover overlay for grid cards */}
        {!isRecommendationPanel && (
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
              opacity: hovered === index ? 1 : 0,
            }}
          />
        )}

        <div
          className={cn(
            'absolute inset-0 flex flex-col justify-end px-5 pb-5 transition-opacity duration-300',
            !isRecommendationPanel && hovered === index ? 'opacity-100' : 'opacity-0',
            isRecommendationPanel && 'opacity-100',
          )}
        >
          {isRecommendationPanel && (
            <div className="relative h-full flex flex-col justify-end pb-4 pl-4">
              <p className="hero-title text-5xl md:text-7xl text-white mb-3">{card.title}</p>
              <p className="text-white/60 w-96 text-sm leading-relaxed font-light line-clamp-2 mb-6">{card.overview}</p>

              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="lg"
                  className="h-10 px-6 bg-white text-black hover:bg-white/90 cursor-pointer font-medium text-sm rounded-md"
                >
                  <PlayCircle className="size-4" />
                  Assistir
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-10 px-6 font-medium text-sm text-white bg-transparent border-white/30 hover:border-white/60 hover:bg-white/5 hover:text-white cursor-pointer rounded-md"
                >
                  <Bookmark className="size-4" />
                  Adicionar
                </Button>

                <div className="ml-auto flex items-center gap-2 mr-4">
                  <Star className="fill-white size-3.5 text-white" />
                  <span className="text-white/80 text-sm font-medium">{card.vote_average.toFixed(1)}</span>
                  <span className="text-white/30 text-sm">·</span>
                  <span className="text-white/50 text-xs uppercase tracking-wider">{card.category === 'movie' ? 'Filme' : 'Série'}</span>
                </div>
              </div>
            </div>
          )}

          {!isRecommendationPanel && (
            <div>
              <p className="text-white font-medium text-sm leading-tight mb-1.5">{card.title}</p>
              <div className="flex items-center gap-2">
                <Star className="fill-white/70 size-3 text-white/70" />
                <span className="text-white/60 text-xs">{card.vote_average.toFixed(1)}</span>
                <span className="text-white/25 text-xs">·</span>
                <span className="text-white/40 text-xs uppercase tracking-wider">{card.category === 'movie' ? 'Filme' : 'Série'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
)

Card.displayName = 'Card'

export function FocusCards({ cards }: Readonly<{ cards: Card[] }>) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  )
}
