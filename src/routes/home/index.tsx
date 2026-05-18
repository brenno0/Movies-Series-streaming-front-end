/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetMovies, useGetTopRatedMovies, useGetNowPlayingMovies } from '@/api/movies'
import { useGetSeries, useGetTopRatedSeries, useGetOnAirSeries } from '@/api/series'
import { useDiscoverMovies, useDiscoverSeries } from '@/api/filters'
import { CarouselComponent } from '@/components/Carousel'
import { Card } from '@/components/FocusCards'
import { QueryParamInput } from '@/components/QueryParamInput'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import type { Item } from '@/types'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/home/')({
  component: HomeComponent,
})

const AUTH_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY',
  },
}

// Reusable section wrapper with consistent heading + optional "Ver todos" link
function HomeSection({
  label,
  title,
  viewAllHref,
  children,
}: {
  label: string
  title: string
  viewAllHref?: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-12 px-8 md:px-12">
      <div className="flex items-center justify-between mb-5">
        <div className="section-heading">
          <div>
            <span className="section-label block mb-1">{label}</span>
            <p className="text-lg font-bold text-white">{title}</p>
          </div>
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref as any}
            className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-white"
            style={{ color: 'oklch(62% 0.18 195)' }}
          >
            Ver todos
            <ChevronRight className="size-3.5" />
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}

function CarouselSkeleton() {
  return (
    <div className="flex gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="flex-1 h-56 rounded-lg" />
      ))}
    </div>
  )
}

function toMovieItem(movie: any): Item {
  return {
    title: movie.title,
    image: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
    backdropImage: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
    vote_average: movie.vote_average,
    category: 'movie',
    overview: movie.overview ?? '',
    genre_ids: movie.genre_ids,
    id: movie.id,
  }
}

function toSeriesItem(s: any): Item {
  return {
    title: s.name,
    image: `https://image.tmdb.org/t/p/w500/${s.poster_path}`,
    backdropImage: `https://image.tmdb.org/t/p/original/${s.backdrop_path}`,
    vote_average: s.vote_average,
    category: 'series',
    overview: s.overview ?? '',
    genre_ids: s.genre_ids,
    id: s.id,
  }
}

export function HomeComponent() {
  const navigate = useNavigate()

  // Core data
  const { data: moviesData, isPending: isLoadingMovies } = useGetMovies({ options: AUTH_OPTIONS })
  const { data: seriesData, isPending: isLoadingSeries } = useGetSeries({ options: AUTH_OPTIONS })

  // Extended rows
  const { data: topRatedMoviesData, isLoading: isLoadingTopMovies } = useGetTopRatedMovies({ options: AUTH_OPTIONS })
  const { data: nowPlayingData, isLoading: isLoadingNowPlaying } = useGetNowPlayingMovies({ options: AUTH_OPTIONS })
  const { data: topRatedSeriesData, isLoading: isLoadingTopSeries } = useGetTopRatedSeries({ options: AUTH_OPTIONS })
  const { data: onAirSeriesData, isLoading: isLoadingOnAir } = useGetOnAirSeries({ options: AUTH_OPTIONS })

  // Genre rows
  const { data: actionMoviesData, isLoading: isLoadingAction } = useDiscoverMovies({ options: AUTH_OPTIONS, genreId: 28 })
  const { data: sciFiData, isLoading: isLoadingSciFi } = useDiscoverMovies({ options: AUTH_OPTIONS, genreId: 878 })
  const { data: dramaSeriesData, isLoading: isLoadingDrama } = useDiscoverSeries({ options: AUTH_OPTIONS, genreId: 18 })

  const movies = moviesData?.results.map(toMovieItem) ?? []
  const series = seriesData?.results.map(toSeriesItem) ?? []
  const topRatedMovies = topRatedMoviesData?.results.map(toMovieItem) ?? []
  const nowPlaying = nowPlayingData?.results.map(toMovieItem) ?? []
  const topRatedSeries = topRatedSeriesData?.results.map(toSeriesItem) ?? []
  const onAirSeries = onAirSeriesData?.results.map(toSeriesItem) ?? []
  const actionMovies = actionMoviesData?.results.map(toMovieItem) ?? []
  const sciFiMovies = sciFiData?.results.map(toMovieItem) ?? []
  const dramaSeries = dramaSeriesData?.results.map(toSeriesItem) ?? []

  const recommended = [
    ...movies.map((m) => ({ ...m, image: m.backdropImage })),
    ...series.map((s) => ({ ...s, image: s.backdropImage })),
  ].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      navigate({ to: `/search`, search: { querySearch: e.currentTarget.value } })
    }
  }

  const isHeroLoading = isLoadingSeries || isLoadingMovies

  return (
    <>
      {/* Hero skeleton */}
      {isHeroLoading ? (
        <div className="px-8 md:px-12">
          <Skeleton data-testid="skeleton" className="w-full h-[70vh] rounded-xl" />
          <div className="flex gap-3 mt-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton data-testid="skeleton" key={i} className="flex-1 h-64 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* ── Hero Carousel ─────────────────────── */}
          <div className="w-full">
            <CarouselComponent<Item>
              hasArrows={false}
              delayInMilliseconds={5000}
              type="full"
              items={recommended}
            >
              {({ item, itemIndex, hovered, setHovered }) => (
                <Card
                  index={itemIndex}
                  card={item as any}
                  hovered={hovered}
                  handleCardClick={() =>
                    item.category === 'movie'
                      ? navigate({ to: `/movie/${item.id}` })
                      : navigate({ to: `/series/${item.id}` })
                  }
                  type="full"
                  isRecommendationPanel={true}
                  setHovered={setHovered}
                />
              )}
            </CarouselComponent>
          </div>

          {/* ── Search ────────────────────────────── */}
          <div className="px-8 md:px-12 mt-12">
            <div className="max-w-md">
              <Label className="section-label mb-3 block" style={{ color: 'oklch(62% 0.18 195)' }}>
                Buscar conteúdo
              </Label>
              <form>
                <QueryParamInput
                  className="h-10 bg-white/5 border-white/10 rounded-md text-sm placeholder:text-white/30"
                  onKeyDown={onKeyDown}
                />
              </form>
            </div>
          </div>

          {/* ── Filmes Populares ──────────────────── */}
          <HomeSection label="Em alta" title="Filmes Populares" viewAllHref="/movies">
            <CarouselComponent<Item> items={movies}>
              {({ item, itemIndex, hovered, setHovered }) => (
                <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                  handleCardClick={() => navigate({ to: `/movie/${item.id}` })}
                  isRecommendationPanel={false} setHovered={setHovered} />
              )}
            </CarouselComponent>
          </HomeSection>

          {/* ── Séries Populares ──────────────────── */}
          <HomeSection label="Em alta" title="Séries Populares" viewAllHref="/series">
            <CarouselComponent<Item> items={series}>
              {({ item, itemIndex, hovered, setHovered }) => (
                <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                  handleCardClick={() => navigate({ to: `/series/${item.id}` })}
                  isRecommendationPanel={false} setHovered={setHovered} />
              )}
            </CarouselComponent>
          </HomeSection>

          {/* ── Gêneros ───────────────────────────── */}
          <div className="mt-12 px-8 md:px-12">
            <div className="mb-5">
              <span className="section-label block mb-1">Explorar</span>
              <p className="text-lg font-bold text-white">Navegar por Gênero</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 28, name: 'Ação', type: 'movie' },
                { id: 35, name: 'Comédia', type: 'movie' },
                { id: 18, name: 'Drama', type: 'series' },
                { id: 27, name: 'Terror', type: 'movie' },
                { id: 878, name: 'Sci-Fi', type: 'movie' },
                { id: 53, name: 'Thriller', type: 'movie' },
                { id: 16, name: 'Animação', type: 'movie' },
                { id: 80, name: 'Crime', type: 'series' },
                { id: 10765, name: 'Fantasia', type: 'series' },
                { id: 99, name: 'Documentário', type: 'movie' },
                { id: 10749, name: 'Romance', type: 'movie' },
                { id: 9648, name: 'Mistério', type: 'movie' },
              ].map((genre) => (
                <button
                  key={genre.id}
                  onClick={() =>
                    navigate({
                      to: '/genre/' as any,
                      search: { genreId: genre.id, genreName: genre.name, type: genre.type } as any,
                    })
                  }
                  className="px-4 py-1.5 rounded-full text-sm font-medium border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200 cursor-pointer"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Nos Cinemas ───────────────────────── */}
          <HomeSection label="Nos cinemas agora" title="Em Cartaz" viewAllHref="/movies">
            {isLoadingNowPlaying ? <CarouselSkeleton /> : (
              <CarouselComponent<Item> items={nowPlaying}>
                {({ item, itemIndex, hovered, setHovered }) => (
                  <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                    handleCardClick={() => navigate({ to: `/movie/${item.id}` })}
                    isRecommendationPanel={false} setHovered={setHovered} />
                )}
              </CarouselComponent>
            )}
          </HomeSection>

          {/* ── Top Avaliados — Filmes ─────────────── */}
          <HomeSection label="Melhores avaliados" title="Top Filmes" viewAllHref="/movies">
            {isLoadingTopMovies ? <CarouselSkeleton /> : (
              <CarouselComponent<Item> items={topRatedMovies}>
                {({ item, itemIndex, hovered, setHovered }) => (
                  <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                    handleCardClick={() => navigate({ to: `/movie/${item.id}` })}
                    isRecommendationPanel={false} setHovered={setHovered} />
                )}
              </CarouselComponent>
            )}
          </HomeSection>

          {/* ── Ação ──────────────────────────────── */}
          <HomeSection label="Gênero" title="Ação" viewAllHref="/genre?genreId=28&genreName=Ação&type=movie">
            {isLoadingAction ? <CarouselSkeleton /> : (
              <CarouselComponent<Item> items={actionMovies}>
                {({ item, itemIndex, hovered, setHovered }) => (
                  <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                    handleCardClick={() => navigate({ to: `/movie/${item.id}` })}
                    isRecommendationPanel={false} setHovered={setHovered} />
                )}
              </CarouselComponent>
            )}
          </HomeSection>

          {/* ── Séries no Ar ──────────────────────── */}
          <HomeSection label="Passando agora" title="Séries no Ar" viewAllHref="/series">
            {isLoadingOnAir ? <CarouselSkeleton /> : (
              <CarouselComponent<Item> items={onAirSeries}>
                {({ item, itemIndex, hovered, setHovered }) => (
                  <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                    handleCardClick={() => navigate({ to: `/series/${item.id}` })}
                    isRecommendationPanel={false} setHovered={setHovered} />
                )}
              </CarouselComponent>
            )}
          </HomeSection>

          {/* ── Drama — Séries ─────────────────────── */}
          <HomeSection label="Gênero" title="Drama" viewAllHref="/genre?genreId=18&genreName=Drama&type=series">
            {isLoadingDrama ? <CarouselSkeleton /> : (
              <CarouselComponent<Item> items={dramaSeries}>
                {({ item, itemIndex, hovered, setHovered }) => (
                  <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                    handleCardClick={() => navigate({ to: `/series/${item.id}` })}
                    isRecommendationPanel={false} setHovered={setHovered} />
                )}
              </CarouselComponent>
            )}
          </HomeSection>

          {/* ── Top Séries ────────────────────────── */}
          <HomeSection label="Melhores avaliadas" title="Top Séries" viewAllHref="/series">
            {isLoadingTopSeries ? <CarouselSkeleton /> : (
              <CarouselComponent<Item> items={topRatedSeries}>
                {({ item, itemIndex, hovered, setHovered }) => (
                  <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                    handleCardClick={() => navigate({ to: `/series/${item.id}` })}
                    isRecommendationPanel={false} setHovered={setHovered} />
                )}
              </CarouselComponent>
            )}
          </HomeSection>

          {/* ── Sci-Fi ────────────────────────────── */}
          <HomeSection label="Gênero" title="Sci-Fi" viewAllHref="/genre?genreId=878&genreName=Sci-Fi&type=movie" >
            {isLoadingSciFi ? <CarouselSkeleton /> : (
              <CarouselComponent<Item> items={sciFiMovies}>
                {({ item, itemIndex, hovered, setHovered }) => (
                  <Card index={itemIndex} card={item as any} hovered={hovered} type="six-per-row"
                    handleCardClick={() => navigate({ to: `/movie/${item.id}` })}
                    isRecommendationPanel={false} setHovered={setHovered} />
                )}
              </CarouselComponent>
            )}
          </HomeSection>

          <div className="mb-16" />
        </div>
      )}
    </>
  )
}
