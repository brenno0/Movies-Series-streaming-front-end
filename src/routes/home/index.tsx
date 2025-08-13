import { useGetMovies } from '@/api/movies'
import { useGetSeries } from '@/api/series'
import { CarouselComponent } from '@/components/Carousel'
import { Card } from '@/components/FocusCards'
import { QueryParamInput } from '@/components/QueryParamInput'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import type { Item } from '@/types'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/home/')({
  component: HomeComponent,
})

function HomeComponent() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY',
    },
  }

  const navigate = useNavigate()
  const { data, isPending: isLoadingMovies } = useGetMovies({ options })
  const { data: seriesData, isPending: isLoadingSeries } = useGetSeries({
    options,
  })

  const series = seriesData?.results.map((series) => {
    return {
      title: series.name,
      image: `https://image.tmdb.org/t/p/w500/${series.poster_path}`,
      backdropImage: `https://image.tmdb.org/t/p/original/${series.backdrop_path}`,
      vote_average: series.vote_average,
      category: 'series' as const,
      overview: series.overview,
      genre_ids: series.genre_ids,
      id: series.id,
    }
  })

  const movies = data?.results.map((movie) => {
    return {
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      backdropImage: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
      vote_average: movie.vote_average,
      category: 'movie' as const,
      overview: movie.overview,
      genre_ids: movie.genre_ids,
      id: movie.id,
    }
  })
  const recommended = [
    ...(movies || []).map((m) => ({
      ...m,
      image: m.backdropImage.replace('/w500/', '/original/'), // força original
    })),
    ...(series || []).map((s) => ({
      ...s,
      image: s.backdropImage.replace('/w500/', '/original/'), // força original
    })),
  ].sort((a, b) => b.vote_average - a.vote_average)

  const isLoading = isLoadingSeries || isLoadingMovies

  return (
    <>
      {isLoading ? (
        <>
          <Skeleton className="w-9/10 h-100 mt-30 mx-auto rounded-2xl" />
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={`key-${index}`}
                className="w-1/5 gap-2 h-100 mt-30 mx-auto rounded-2xl"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-4 px-10">
          <CarouselComponent<Item>
            hasArrows={false}
            delayInMilliseconds={5000}
            type="full"
            items={recommended || []}
          >
            {({ item, itemIndex, hovered, setHovered }) => (
              <Card
                index={itemIndex}
                card={item}
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

          <div className="w-full flex justify-center">
            <div className="w-full px-5 mt-10 ">
              <Label className="mb-3">Buscar por filmes/séries</Label>
              <QueryParamInput className="rounded-[8px] " />
            </div>
          </div>
          <p className="text-2xl font-bold text-left ml-5 text-white">
            Filmes Populares
          </p>
          <CarouselComponent<Item> items={movies || []}>
            {({ item, itemIndex, hovered, setHovered }) => (
              <Card
                index={itemIndex}
                card={item}
                hovered={hovered}
                type="six-per-row"
                handleCardClick={() => navigate({ to: `/movie/${item.id}` })}
                isRecommendationPanel={false}
                setHovered={setHovered}
              />
            )}
          </CarouselComponent>

          <div className="flex flex-wrap items-center gap-4  w-full mb-10">
            <p className="text-2xl font-bold text-left ml-5 mt-10 text-white">
              Séries Populares
            </p>
            <CarouselComponent<Item> items={series || []}>
              {({ item, itemIndex, hovered, setHovered }) => (
                <Card
                  index={itemIndex}
                  card={item}
                  hovered={hovered}
                  type="six-per-row"
                  handleCardClick={() => navigate({ to: `/series/${item.id}` })}
                  isRecommendationPanel={false}
                  setHovered={setHovered}
                />
              )}
            </CarouselComponent>
          </div>
        </div>
      )}
    </>
  )
}
