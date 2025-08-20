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

  const movieUrl = `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${episode}`

  if (isSeriesError || !series) {
    return <p>Erro ao carregar dados do filme.</p>
  }

  const backdropImage = `https://image.tmdb.org/t/p/original/${series.backdrop_path}`

  return (
    <div>
      {isSeriesLoading || isFetchingRecommendedMovies || isFetchingCredits ? (
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
        <div>
          <div className="rounded-2xl h-[55vh] relative overflow-hidden transition-all duration-300 ease-out">
            <img
              src={backdropImage}
              alt={series.name}
              className="object-contain object-center absolute inset-0 w-full "
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
                <ArrowLeft color="white" />
              </Link>
              <div className=" h-full flex flex-col justify-end mt-10 ">
                <p className="font-bold text-4xl mt-5 md:text-6xl">
                  {series.name}
                </p>
                <div className="w-full flex items-center mt-2 mb-2 gap-1">
                  <p className="font-bold text-zinc-300">
                    {moment(series.first_air_date).year()}
                  </p>
                  <div className="border-0.5 my-1 border-l mx-2 border-primary h-5"></div>
                  {series.genres.map((genre) => (
                    <div key={genre.id} className="text-zinc-300">
                      {genre.name}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Button
                    variant="default"
                    size="lg"
                    className="h-10 w-50 text-lg !rounded-[8px] bg-primary text-white hover:bg-blue-800 cursor-pointer"
                  >
                    <PlayCircle strokeWidth={1} className="size-lg" />
                    Assistir
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="ml-10 h-10 text-lg w-50 mt-3  !rounded-[8px]  font-bold text-white  bg-transparent border-white hover:border-white/70 hover:text-white/70 hover:bg-transparent cursor-pointer"
                  >
                    <Bookmark strokeWidth={1} className="size-lg" />
                    Adicionar a Lista
                  </Button>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div className="mx-4 mt-10 mb-10">
            <div className="px-4 mb-5">
              <p className="text-2xl mb-6 font-bold mt-6">Sinopse</p>
              <p className="my-8 text-zinc-300">{series.overview}</p>
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
                        <p className="text-zinc-500 text-sm">
                          {item.character}
                        </p>
                      </div>
                    </div>
                  )}
                </CarouselComponent>
              </div>
              <div className="my-10">
                <div className="flex justify-between">
                  <p className="text-2xl  font-bold ">
                    Episódios{' '}
                    {String(episodesData?.episodes[0].episode_number) +
                      ' - ' +
                      String(
                        episodesData?.episodes[
                          episodesData?.episodes.length - 1
                        ].episode_number,
                      )}
                  </p>
                  <Select
                    onValueChange={(value) => setSelectedSeason(Number(value))}
                    defaultValue={series.seasons[0].season_number.toString()}
                  >
                    <SelectTrigger className="w-[180px] rounded-[8px]">
                      <SelectValue placeholder="Temporada" />
                    </SelectTrigger>
                    <SelectContent>
                      {series.seasons.map((season) => (
                        <SelectItem
                          key={season.name}
                          value={season.season_number.toString()}
                        >
                          {season.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4">
                  {/* {Todo: Come back here and make a not found for seasons that has no episodes launched yet} */}
                  {isFetchingEpisodes ? (
                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                          key={`key-${index}`}
                          className="w-1/5 gap-2 h-50 mt-10 mx-auto rounded-2xl"
                        />
                      ))}
                    </div>
                  ) : (
                    <CarouselComponent<IEpisode>
                      autoplay={false}
                      items={episodesData?.episodes || []}
                    >
                      {({ item }) => (
                        <ModalComponent
                          className="!z-[99999999999] min-w-[90vw] min-h-[90vh]"
                          modalTitle={series.name}
                          modalBodyTemplate={
                            <MovieModalContent
                              movieTitle={series.name}
                              movieURL={movieUrl}
                            />
                          }
                        >
                          <div className="relative w-full max-h-41 overflow-hidden rounded-lg group">
                            <motion.div
                              initial="hidden"
                              whileHover="visible"
                              className="relative w-full h-full"
                              onClick={() => setEpisode(item.episode_number)}
                            >
                              <motion.img
                                alt={item.name}
                                src={`https://image.tmdb.org/t/p/w500/${item.still_path ?? episodesData?.poster_path}`}
                                className="w-full max-h-41 object-cover"
                                variants={{
                                  hidden: { scale: 1 },
                                  visible: { scale: 1.05 },
                                }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                              />
                              {/* Overlay */}
                              <motion.div
                                className="absolute inset-0 flex flex-col justify-end p-2"
                                variants={{
                                  hidden: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                  },
                                  visible: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  },
                                }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                              >
                                <motion.div
                                  variants={{
                                    hidden: { height: '2rem' },
                                    visible: { height: 'auto' },
                                  }}
                                  transition={{
                                    duration: 0.4,
                                    ease: 'easeOut',
                                  }}
                                  className="overflow-hidden"
                                >
                                  <motion.p
                                    className="text-white font-bold"
                                    variants={{
                                      hidden: { y: 0, opacity: 1 },
                                      visible: { y: 0, opacity: 1 },
                                    }}
                                  >
                                    {'Ep.' +
                                      item.episode_number +
                                      ' ' +
                                      item.name}
                                  </motion.p>
                                  <motion.p
                                    className="text-white text-sm mt-1"
                                    variants={{
                                      hidden: { opacity: 0, y: 10 },
                                      visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{
                                      duration: 0.3,
                                      delay: 0.1,
                                      ease: 'easeOut',
                                    }}
                                  >
                                    {truncateText(item.overview, 100)}
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
            </div>

            <p className="text-xl mb-6 font-bold mt-6">Séries semelhantes</p>
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
      )}
    </div>
  )
}
