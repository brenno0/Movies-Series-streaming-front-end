"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Bookmark, PlayCircle, Star } from "lucide-react";
import { Button } from "../ui/button";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    type,
    isRecommendationPanel = false,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    type?:'full' | 'six-per-row'
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    isRecommendationPanel?:boolean
  }) => {
    
    return (
      <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-2xl relative dark:bg-neutral-900 overflow-hidden  transition-all duration-300 ease-out",
        type === 'full' ? 'h-180' : 'h-60 md:h-96',
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      <img
        src={card.image}
        alt={card.title}
        className="object-cover absolute inset-0 w-full h-full"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex flex-col justify-end py-8 px-4 transition-opacity duration-300",
          (!isRecommendationPanel && hovered === index) ? "opacity-100" : "opacity-0",
          isRecommendationPanel && "opacity-100",
        )}
      >
        {isRecommendationPanel && (
          <div className="relative h-full top-20 left-10" >
            <p className="font-bold text-4xl md:text-6xl" >{card.title}</p> 
            <p className="mt-10 text-blue-100 w-100 " >{card.overview}</p>

            <Button variant="default" size='lg' className="h-12 w-70 mt-10 bg-primary text-white hover:bg-blue-800 cursor-pointer" ><PlayCircle />Assistir</Button>
            <Button variant="outline" size='lg' className="ml-10 h-12 w-70 mt-10 font-bold text-white  bg-transparent border-white hover:border-white/70 hover:text-white/70 hover:bg-transparent cursor-pointer" ><Bookmark />Adicionar a Lista</Button>
          </div>
        )}
          {!isRecommendationPanel && (
              <div className="text-xl text-white md:text-2xl font-bold">
                {card.title}
              </div>
          )} 
          <div className="w-full flex items-center mt-2 gap-1">
            <Star className="fill-current size-5 text-primary" />
            <p className="font-bold text-white" >{card.vote_average.toFixed(2)}</p>
            <div className="border-0.5 ml-1 border-l border-primary h-5" ></div>
            <p className="text-blue-300 font-bold" >{card.category === "movie" ? "Filme" : "Série"}</p>
          </div>

      </div>
    </div>
    )
  }
  )

Card.displayName = "Card";

type Card = {
  title: string;
  image: string;
};

export function FocusCards({ cards }: Readonly<{ cards: Card[] }>) {
  const [hovered, setHovered] = useState<number | null>(null);

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
  );
} 
