"use client"

import { useState } from "react"
import "keen-slider/keen-slider.min.css"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Card } from "../FocusCards"
import Autoplay from "embla-carousel-autoplay";

interface Item {
  title: string
  image: string
  vote_average?: number;
  category:'movie' | 'series',
  overview?:string,
}

export function CarouselComponent({ items, type = 'six-per-row',  isRecommendationPanel = false, delayInMilliseconds = 2000 }: Readonly<{ items: Item[], type?:'full' | 'six-per-row', isRecommendationPanel?:boolean, delayInMilliseconds?:number }>) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="keen-slider px-4 w-full">
          <Carousel 
          className="w-full h-full"
          plugins={[
            Autoplay({
              delay: delayInMilliseconds,
              stopOnInteraction: false,
            }),
          ]}
           >
          <CarouselContent>
          {items.map((item, idx) => {
            return (
              <CarouselItem 
              className={`${type === 'full' ? 'basis-1/1 h-180 w-full' : 'basis-1/6' }`} 
              key={item.title}
             
              >
                <Card
                index={idx}
                card={item}
                hovered={hovered}
                type={type}
                isRecommendationPanel={isRecommendationPanel}
                setHovered={setHovered}
                />
              </CarouselItem>
              )
            })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
