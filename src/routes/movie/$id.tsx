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

  const { data: creditsData } =
    useGetMovieCredits({ options, movieId: id })

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
      <div className="px-8 md:px-12">
        <Skeleton data-testid="skeleton" className="w-full h-[65vh] rounded-none" />
        <div className="flex gap-3 mt-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton data-testid="skeleton" key={`key-${index}`} className="flex-1 h-56 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isMovieError || !movie) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <p className="text-white/40 text-sm">Erro ao carregar dados do filme.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Hero — full bleed, no rounded corners */}
      <div className="h-[65vh] relative overflow-hidden">
        <img
          src={backdropImage}
          alt={movie.title}
          className="object-cover object-center absolute inset-0 w-full h-full"
        />
        {/* Full gradient overlay fading into page bg */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, oklch(9% 0 0) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.2) 100%)',
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-between py-8 px-8 md:px-12">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit">
            <ArrowLeft className="size-4" />
            <span className="text-sm">Voltar</span>
          </Link>

          <div className="pb-2">
            <p className="hero-title text-5xl md:text-7xl text-white mb-4">{movie.title}</p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-white/50 border border-white/20 px-2 py-0.5 rounded">
                IMDB {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/50 text-sm">{moment(movie.release_date).year()}</span>
              {movie.genres.slice(0, 3).map((genre) => (
                <span key={genre.id} className="text-white/30 text-xs">·</span>
              ))}
              {movie.genres.slice(0, 3).map((genre, i) => (
                <span key={genre.id} className="text-white/50 text-sm">{genre.name}{i < Math.min(movie.genres.length, 3) - 1 ? '' : ''}</span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-5">
              <ModalComponent
                className="!z-[99999999999] min-w-[90vw] min-h-[90vh]"
                modalTitle={movie.title}
                modalBodyTemplate={
                  <MovieModalContent movieTitle={movie.title} movieURL={movieUrl} />
                }
              >
                <Button
                  variant="default"
                  size="lg"
                  className="h-10 px-6 bg-white text-black hover:bg-white/90 cursor-pointer font-medium text-sm rounded-md"
                >
                  <PlayCircle className="size-4" />
                  Assistir
                </Button>
              </ModalComponent>
              <Button
                variant="outline"
                size="lg"
                className="h-10 px-6 font-medium text-sm text-white bg-transparent border-white/30 hover:border-white/60 hover:bg-white/5 hover:text-white cursor-pointer rounded-md"
              >
                <Bookmark className="size-4" />
                Adicionar à Lista
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 md:px-12 mt-10 mb-16 space-y-12">
        {/* Sinopse */}
        <div>
          <span className="section-label block mb-2">Sobre o filme</span>
          <p className="text-lg font-semibold text-white mb-4">Sinopse</p>
          <p className="text-white/55 leading-relaxed max-w-3xl font-light">{movie.overview}</p>
        </div>

        {/* Elenco */}
        <div>
          <span className="section-label block mb-2">Quem está no filme</span>
          <p className="text-lg font-semibold text-white mb-5">Elenco</p>
          <CarouselComponent<CastMember> hasArrows={false} autoplay={false} items={creditsData?.cast || []}>
            {({ item }) => (
              <div key={item.id} className="flex flex-col items-center gap-2 text-center px-1">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt={item.name}
                    src={`https://image.tmdb.org/t/p/w500/${item.profile_path}`}
                  />
                </div>
                <div>
                  <p className="font-medium text-white text-xs leading-tight">{item.name}</p>
                  <p className="text-white/35 text-xs mt-0.5 leading-tight">{item.character}</p>
                </div>
              </div>
            )}
          </CarouselComponent>
        </div>

        {/* Filmes semelhantes */}
        <div>
          <span className="section-label block mb-2">Você também pode gostar</span>
          <p className="text-lg font-semibold text-white mb-5">Filmes Semelhantes</p>
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
    </div>
  )
}
