import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDiscoverSeries } from '@/api/filters'
import { Card } from '@/components/FocusCards'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { Tv } from 'lucide-react'

export const Route = createFileRoute('/series/')({
  component: SeriesPage,
})

const AUTH_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY',
  },
}

function SeriesPage() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<number | null>(null)
  const { data, isLoading } = useDiscoverSeries({ options: AUTH_OPTIONS })

  const series = data?.results.map((s) => ({
    title: s.name,
    image: `https://image.tmdb.org/t/p/w500/${s.poster_path}`,
    backdropImage: `https://image.tmdb.org/t/p/original/${s.backdrop_path}`,
    vote_average: s.vote_average,
    category: 'series' as const,
    overview: s.overview ?? '',
    genre_ids: s.genre_ids,
    id: s.id,
  }))

  return (
    <div className="px-8 md:px-12 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Tv className="size-5" style={{ color: 'oklch(62% 0.18 195)' }} />
        <div className="section-heading">
          <p className="text-2xl font-bold text-white">Séries</p>
        </div>
        {!isLoading && (
          <span className="text-white/30 text-sm ml-1">
            {data?.total_results?.toLocaleString('pt-BR')} títulos
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {series?.map((s, index) => (
            <Card
              key={s.id}
              card={s}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
              type="six-per-row"
              isRecommendationPanel={false}
              handleCardClick={() => navigate({ to: `/series/${s.id}` })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
