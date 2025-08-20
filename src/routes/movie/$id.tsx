import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  useGetMovieById,
  useGetMovieCredits,
  useGetRecommendedMovies,
} from '@/api/movies'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bookmark, PlayCircle } from 'lucide-react'
import { CarouselComponent } from '@/components/Carousel'
import moment from 'moment'
import { ModalComponent } from '@/components/Modal'
import { MovieModalContent } from './ui/movieModal'
import { Card } from '@/components/FocusCards'
import { Skeleton } from '@/components/ui/skeleton'
import type { CastMember } from '@/types'

export const Route = createFileRoute('/movie/$id')({
  component: Movie,
})

export function Movie() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY',
    },
  }

  const navigate = useNavigate()
  const { id } = Route.useParams()

  // Buscar o filme pelo ID
  const {
    data: movie,
    isLoading: isMovieLoading,
    isError: isMovieError,
  } = useGetMovieById({ options, movieId: id })

  const { data: recommendedMoviesData } = useGetRecommendedMovies({
    options,
    movieId: Number(id),
  })

  const { data: creditsData, isLoading: isFetchingCredits } =
    useGetMovieCredits({ options, movieId: id })
  console.log('creditsData', creditsData)

  const recommendedMovies = recommendedMoviesData?.results.map((movie) => {
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

  const movieUrl = `https://vidsrc.icu/embed/movie/${movie?.imdb_id ?? ''}`
  // const movieUrl = ` https://multiembed.mov/?video_id=${movie?.imdb_id ?? ''}`
  const backdropImage = `https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`

  if (isMovieLoading) {
    return (
      <>
        <Skeleton
          data-testid="skeleton"
          className="w-9/10 h-100 mt-30 mx-auto rounded-2xl"
        />
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              data-testid="skeleton"
              key={`key-${index}`}
              className="w-1/5 gap-2 h-100 mt-30 mx-auto rounded-2xl"
            />
          ))}
        </div>
      </>
    )
  }

  if (isMovieError || !movie) {
    return <p>Erro ao carregar dados do filme.</p>
  }

  return (
    <div>
      <div className="rounded-2xl h-[55vh] relative overflow-hidden transition-all duration-300 ease-out">
        <img
          src={backdropImage}
          alt={movie.title}
          className="object-cover object-center absolute inset-0 w-full "
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-start py-8 px-4 transition-opacity duration-300">
          <Link to="/">
            <ArrowLeft color="oklch(54.6% 0.245 262.881)" />
          </Link>
          <div className=" h-full flex flex-col justify-end ">
            <p className="font-bold text-4xl mt-5 md:text-5xl">{movie.title}</p>
            <div className="w-full flex items-center my-6 gap-1">
              <div className="h-5 w-15 bg-primary py-4 flex justify-center items-center font-bold mr-2 rounded-[8px]">
                IMDB
              </div>
              <p className="font-bold text-white">
                {movie.vote_average.toFixed(2)}
              </p>
              <div className="border-0.5 my-1 border-l mx-2 border-primary h-5"></div>
              <p className="font-bold text-white">
                {moment(movie.release_date).year()}
              </p>
            </div>
            <div className="mt-2 mx-2 flex w-full gap-2">
              {movie.genres.map((genre) => (
                <div key={genre.id} className="text-zinc-300">
                  {genre.name}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <ModalComponent
                className="!z-[99999999999] min-w-[90vw] min-h-[90vh]"
                modalTitle={movie.title}
                modalBodyTemplate={
                  <MovieModalContent
                    movieTitle={movie.title}
                    movieURL={movieUrl}
                  />
                }
              >
                <Button
                  variant="default"
                  size="lg"
                  className="h-10 w-50 text-lg !rounded-[8px] bg-primary text-white hover:bg-blue-800 cursor-pointer"
                >
                  <PlayCircle strokeWidth={1} className="size-lg" />
                  Assistir
                </Button>
              </ModalComponent>
              <Button
                variant="outline"
                size="lg"
                className="ml-10 h-10 text-lg w-50 mt-3  !rounded-[8px]  font-bold text-white  bg-transparent border-white hover:border-white/70 hover:text-white/70 hover:bg-transparent cursor-pointer"
              >
                <Bookmark strokeWidth={1} className="size-lg" />
                Adicionar a Lista
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-5 mb-10">
        <div className="px-4 mb-15">
          <p className="text-2xl mb-6 font-bold mt-6">Sinopse</p>
          <p className="my-8 text-zinc-300">{movie.overview}</p>
        </div>
        <div className="px-4 mb-30">
          <p className="text-2xl mb-6 font-bold mt-6">Elenco</p>
          <div className="flex gap-6">
            <CarouselComponent<CastMember>
              hasArrows={false}
              items={creditsData?.cast || []}
            >
              {({ item }) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    alt={item.name}
                    src={`https://image.tmdb.org/t/p/w500/${item.profile_path}`}
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-zinc-500 text-sm">{item.character}</p>
                  </div>
                </div>
              )}
            </CarouselComponent>
          </div>
        </div>
        <p className="text-xl mb-6 font-bold mt-6">Filmes semelhantes</p>
        <CarouselComponent items={recommendedMovies || []}>
          {({ item, itemIndex, hovered, setHovered }) => (
            <Card
              data-testid="recommended-movies-card"
              index={itemIndex}
              card={item}
              handleCardClick={() => navigate({ to: `/movie/${item.id}` })}
              hovered={hovered}
              type="six-per-row"
              isRecommendationPanel={false}
              setHovered={setHovered}
            />
          )}
        </CarouselComponent>
      </div>
    </div>
  )
}
