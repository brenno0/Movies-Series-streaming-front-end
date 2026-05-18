import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useInfiniteDiscoverMovies } from '@/api/filters'
import { Card } from '@/components/FocusCards'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect, useRef } from 'react'
import { Film } from 'lucide-react'

export const Route = createFileRoute('/movies/')({
  component: MoviesPage,
})

const AUTH_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY',
  },
}

function MoviesPage() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteDiscoverMovies({ options: AUTH_OPTIONS })

  const movies = data?.pages.flatMap((page) =>
    page.results.map((movie) => ({
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      backdropImage: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
      vote_average: movie.vote_average,
      category: 'movie' as const,
      overview: movie.overview ?? '',
      genre_ids: movie.genre_ids,
      id: movie.id,
    })),
  )

  const totalResults = data?.pages[0]?.total_results

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="px-8 md:px-12 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Film className="size-5" style={{ color: 'oklch(62% 0.18 195)' }} />
        <div className="section-heading">
          <p className="text-2xl font-bold text-white">Filmes</p>
        </div>
        {!isLoading && totalResults != null && (
          <span className="text-white/30 text-sm ml-1">
            {totalResults.toLocaleString('pt-BR')} títulos
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {movies?.map((movie, index) => (
              <Card
                key={movie.id}
                card={movie}
                index={index}
                hovered={hovered}
                setHovered={setHovered}
                type="six-per-row"
                isRecommendationPanel={false}
                handleCardClick={() => navigate({ to: `/movie/${movie.id}` })}
              />
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-10" />
        </>
      )}
    </div>
  )
}
