import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useInfiniteDiscoverMovies, useInfiniteDiscoverSeries } from '@/api/filters'
import { Card } from '@/components/FocusCards'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect, useRef } from 'react'
import z from 'zod'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/genre/')({
  component: GenrePage,
  validateSearch: z.object({
    genreId: z.number().optional(),
    genreName: z.string().optional(),
    type: z.enum(['movie', 'series']).optional().default('movie'),
  }),
})

const AUTH_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY',
  },
}

function GenrePage() {
  const navigate = useNavigate()
  const { genreId, genreName, type } = useSearch({ from: '/genre/' })
  const [hovered, setHovered] = useState<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const activeType = type ?? 'movie'

  const {
    data: moviesData,
    isLoading: isLoadingMovies,
    isFetchingNextPage: isFetchingMovies,
    fetchNextPage: fetchMoviesNextPage,
    hasNextPage: hasMoviesNextPage,
  } = useInfiniteDiscoverMovies({ options: AUTH_OPTIONS, genreId })

  const {
    data: seriesData,
    isLoading: isLoadingSeries,
    isFetchingNextPage: isFetchingSeries,
    fetchNextPage: fetchSeriesNextPage,
    hasNextPage: hasSeriesNextPage,
  } = useInfiniteDiscoverSeries({ options: AUTH_OPTIONS, genreId })

  const movies = moviesData?.pages.flatMap((page) =>
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

  const series = seriesData?.pages.flatMap((page) =>
    page.results.map((s) => ({
      title: s.name,
      image: `https://image.tmdb.org/t/p/w500/${s.poster_path}`,
      backdropImage: `https://image.tmdb.org/t/p/original/${s.backdrop_path}`,
      vote_average: s.vote_average,
      category: 'series' as const,
      overview: s.overview ?? '',
      genre_ids: s.genre_ids,
      id: s.id,
    })),
  )

  const isLoading = activeType === 'movie' ? isLoadingMovies : isLoadingSeries
  const isFetchingNextPage = activeType === 'movie' ? isFetchingMovies : isFetchingSeries
  const fetchNextPage = activeType === 'movie' ? fetchMoviesNextPage : fetchSeriesNextPage
  const hasNextPage = activeType === 'movie' ? hasMoviesNextPage : hasSeriesNextPage
  const items = activeType === 'movie' ? movies : series

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

  const setType = (t: 'movie' | 'series') => {
    navigate({ to: '/genre/' as any, search: { genreId, genreName, type: t } as any })
  }

  return (
    <div className="px-8 md:px-12 py-10">
      <div className="mb-8">
        <span className="section-label block mb-2">Gênero</span>
        <div className="section-heading mb-5">
          <p className="text-2xl font-bold text-white">{genreName ?? 'Explorar'}</p>
        </div>

        <div className="flex gap-1 mt-4 p-1 rounded-md w-fit" style={{ backgroundColor: 'oklch(14% 0 0)' }}>
          {(['movie', 'series'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                'px-5 py-1.5 rounded text-sm font-medium transition-all duration-200 cursor-pointer',
                activeType === t
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70',
              )}
              style={activeType === t ? { backgroundColor: 'oklch(62% 0.18 195)' } : {}}
            >
              {t === 'movie' ? 'Filmes' : 'Séries'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      ) : items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-3">
          <p className="text-white/10 text-6xl font-thin">⌕</p>
          <p className="text-white/30 text-sm tracking-wide">
            Nenhum resultado encontrado para este gênero
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items?.map((item, index) => (
              <Card
                key={item.id}
                card={item}
                index={index}
                hovered={hovered}
                setHovered={setHovered}
                type="six-per-row"
                isRecommendationPanel={false}
                handleCardClick={() =>
                  navigate({
                    to: item.category === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`,
                  })
                }
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
