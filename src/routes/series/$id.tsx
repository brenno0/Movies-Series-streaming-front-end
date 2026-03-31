import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bookmark, PlayCircle } from 'lucide-react'
import { CarouselComponent } from '@/components/Carousel'
import moment from 'moment'
import { ModalComponent } from '@/components/Modal'
import { MovieModalContent } from './ui/seriesModal'
import {
  useGetRecommendedSeries,
  useGetSeriesById,
  useGetSeriesCredits,
  useGetSeriesEpisodesBySeason,
} from '@/api/series'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/FocusCards'
import type { CastMember, IEpisode } from '@/types'
import { truncateText } from '@/lib/truncateText'
import { motion } from 'motion/react'
import { useState } from 'react'
export const Route = createFileRoute('/series/$id')({
  component: Series,
})

function Series() {
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
    data: series,
    isLoading: isSeriesLoading,
    isError: isSeriesError,
  } = useGetSeriesById({ options, seriesId: id })
  const {
    data: recommendedSeriesData,
    isLoading: isFetchingRecommendedMovies,
  } = useGetRecommendedSeries({ options, seriesId: id })
  const { data: creditsData, isLoading: isFetchingCredits } =
    useGetSeriesCredits({ options, seriesId: id })
  const [selectedSeason, setSelectedSeason] = useState<number | undefined>(1)
  const [episode, setEpisode] = useState<number | undefined>(1)

  const { data: episodesData, isLoading: isFetchingEpisodes } =
    useGetSeriesEpisodesBySeason({
      options,
      seriesId: id,
      seasonNumber: Number(selectedSeason),
      enabled: series?.seasons[0].season_number !== undefined,
    })
  const recommendedSeries = recommendedSeriesData?.results.map((series) => {
    return {
      title: series.title,
      image: `https://image.tmdb.org/t/p/w500/${series.poster_path}`,
      backdropImage: `https://image.tmdb.org/t/p/original/${series.backdrop_path}`,
      vote_average: series.vote_average,
      category: 'series' as const,
      overview: series.overview,
      genre_ids: series.genre_ids,
      id: series.id,
    }
  })

  // const seriesUrl = `https://multiembed.mov/directstram.php?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${episode}`
  const seriesUrl = `https://vidsrc.icu/embed/tv/${id}/${selectedSeason}/${episode}`

  if (isSeriesError || !series) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <p className="text-white/40 text-sm">Erro ao carregar dados da série.</p>
      </div>
    )
  }

  const backdropImage = `https://image.tmdb.org/t/p/original/${series.backdrop_path}`

  return (
    <div>
      {isSeriesLoading || isFetchingRecommendedMovies || isFetchingCredits ? (
        <div className="px-8 md:px-12">
          <Skeleton className="w-full h-[65vh] rounded-none" />
          <div className="flex gap-3 mt-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={`key-${index}`} className="flex-1 h-56 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Hero — full bleed */}
          <div className="h-[65vh] relative overflow-hidden">
            <img
              src={backdropImage}
              alt={series.name}
              className="object-cover object-center absolute inset-0 w-full h-full"
            />
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
                <p className="hero-title text-5xl md:text-7xl text-white mb-4">{series.name}</p>

                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {moment(series.first_air_date).year() > 0 && (
                    <>
                      <span className="text-white/50 text-sm">{moment(series.first_air_date).year()}</span>
                      <span className="text-white/30 text-xs">·</span>
                    </>
                  )}
                  {series.genres.slice(0, 3).map((genre, i) => (
                    <span key={genre.id} className="text-white/50 text-sm">
                      {genre.name}{i < Math.min(series.genres.length, 3) - 1 ? '' : ''}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-5">
                  <Button
                    variant="default"
                    size="lg"
                    className="h-10 px-6 bg-white text-black hover:bg-white/90 cursor-pointer font-medium text-sm rounded-md"
                  >
                    <PlayCircle className="size-4" />
                    Assistir
                  </Button>
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
              <span className="section-label block mb-2">Sobre a série</span>
              <p className="text-lg font-semibold text-white mb-4">Sinopse</p>
              <p className="text-white/55 leading-relaxed max-w-3xl font-light">{series.overview}</p>
            </div>

            {/* Elenco */}
            <div>
              <span className="section-label block mb-2">Quem está na série</span>
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

            {/* Episódios */}
            <div>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <span className="section-label block mb-2">Episódios</span>
                  <p className="text-lg font-semibold text-white">
                    {episodesData?.episodes?.length
                      ? `Ep. ${episodesData.episodes[0].episode_number} — ${episodesData.episodes[episodesData.episodes.length - 1].episode_number}`
                      : 'Episódios'}
                  </p>
                </div>
                <Select
                  onValueChange={(value) => setSelectedSeason(Number(value))}
                  defaultValue={series.seasons[0].season_number.toString()}
                >
                  <SelectTrigger className="w-44 h-9 text-sm rounded-md border-white/15 bg-white/5 text-white/70">
                    <SelectValue placeholder="Temporada" />
                  </SelectTrigger>
                  <SelectContent>
                    {series.seasons.map((season) => (
                      <SelectItem key={season.name} value={season.season_number.toString()}>
                        {season.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                {isFetchingEpisodes ? (
                  <div className="flex gap-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={`key-${index}`} className="flex-1 h-40 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <CarouselComponent<IEpisode> autoplay={false} items={episodesData?.episodes || []}>
                    {({ item }) => (
                      <ModalComponent
                        className="!z-[99999999999] min-w-[90vw] min-h-[90vh]"
                        modalTitle={series.name}
                        modalBodyTemplate={
                          <MovieModalContent movieTitle={series.name} seriesUrl={seriesUrl} />
                        }
                      >
                        <div className="relative w-full overflow-hidden rounded-xl group cursor-pointer">
                          <motion.div
                            initial="hidden"
                            whileHover="visible"
                            className="relative w-full h-full"
                            onClick={() => setEpisode(item.episode_number)}
                          >
                            <motion.img
                              alt={item.name}
                              src={`https://image.tmdb.org/t/p/w500/${item.still_path ?? episodesData?.poster_path}`}
                              className="w-full h-36 object-cover"
                              variants={{ hidden: { scale: 1 }, visible: { scale: 1.06 } }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                            />
                            <motion.div
                              className="absolute inset-0 flex flex-col justify-end p-3"
                              variants={{
                                hidden: { backgroundColor: 'rgba(0,0,0,0.35)' },
                                visible: { backgroundColor: 'rgba(0,0,0,0.72)' },
                              }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                              <motion.div
                                variants={{ hidden: { height: '1.5rem' }, visible: { height: 'auto' } }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="overflow-hidden"
                              >
                                <p className="text-white font-medium text-xs leading-tight">
                                  Ep.{item.episode_number} · {item.name}
                                </p>
                                <motion.p
                                  className="text-white/60 text-xs mt-1.5 leading-relaxed"
                                  variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                                  transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
                                >
                                  {truncateText(item.overview, 90)}
                                </motion.p>
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </ModalComponent>
                    )}
                  </CarouselComponent>
                )}
              </div>
            </div>

            {/* Séries semelhantes */}
            <div>
              <span className="section-label block mb-2">Você também pode gostar</span>
              <p className="text-lg font-semibold text-white mb-5">Séries Semelhantes</p>
              <CarouselComponent items={recommendedSeries || []}>
                {({ item, itemIndex, hovered, setHovered }) => (
                  <Card
                    index={itemIndex}
                    card={item}
                    hovered={hovered}
                    handleCardClick={() => navigate({ to: `/series/${item.id}` })}
                    type="six-per-row"
                    isRecommendationPanel={false}
                    setHovered={setHovered}
                  />
                )}
              </CarouselComponent>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
