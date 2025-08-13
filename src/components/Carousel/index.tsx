"use client"

import { useState } from "react"
import "keen-slider/keen-slider.min.css"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import Autoplay from "embla-carousel-autoplay"
import type { CarouselProps } from "@/types/components/carouselComponent"

export function CarouselComponent<T>({
  items,
  type = 'six-per-row',
  delayInMilliseconds = 2000,
  hasArrows = true,
  autoplay = true,
  children,
}: Readonly< CarouselProps<T> >) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  
  return (
    <div className="relative keen-slider px-4 w-full">
      <Carousel
        className="relative w-full h-full"
        plugins={autoplay ?[
          Autoplay({
            delay: delayInMilliseconds,
            stopOnInteraction: false,
          }),
        ] : []}
      >
        <CarouselContent>
          {items.map((item, idx) => {
            const isDragging = draggingIndex === idx
            const draggingStyle = isDragging ? 'cursor-grabbing' : 'cursor-grab'
            return (
                <CarouselItem
                key={JSON.stringify(item)}
                onMouseDown={() => setDraggingIndex(idx)}
                onMouseUp={() => setDraggingIndex(null)}
                onMouseLeave={() => setDraggingIndex(null)}
                className={`
                  ${type === 'full'
                    ? `basis-1/1 h-180 w-full ${draggingStyle}`
                    : 'basis-1/6 cursor-pointer'}
                `}
              >
                {typeof children === 'function' ? children({ item, itemIndex:idx, hovered, setHovered  }) : children}
              </CarouselItem>
            )
          })}
        </CarouselContent>
        {hasArrows && (
          <>
            <CarouselPrevious className="text-white !rounded-full hover:bg-primary cursor-pointer"  variant="default" />
            <CarouselNext className="text-white !rounded-full hover:bg-primary cursor-pointer" variant="default" />
          </>
        )}
      </Carousel>
    </div>
  )
}
