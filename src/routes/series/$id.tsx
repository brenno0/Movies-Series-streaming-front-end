import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bookmark, BookmarkCheck, PlayCircle } from 'lucide-react'
import { CarouselComponent } from '@/components/Carousel'
import moment from 'moment'
import { ModalComponent } from '@/components/Modal'
import { SeriesModalContent } from './ui/seriesModal'
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
import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCreateMovie, useCreateWatchlist, useDeleteWatchlist } from '@/gen'
import { getWatchlistSuspenseQueryOptions } from '@/gen/hooks/useGetWatchlistSuspense'
import Cookie from 'js-cookie'

const API_BASE = 'http://localhost:3333'

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
  const queryClient = useQueryClient()
  const { id } = Route.useParams()
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<number>(1)

  // Stream state
  const [dubLang, setDubLang] = useState<'pt' | 'en'>(() => (localStorage.getItem('dubLang') as 'pt' | 'en') ?? 'pt')
  const [seriesDbId, setSeriesDbId] = useState<string | null>(null)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [isStreamLoading, setIsStreamLoading] = useState(false)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [playingEpisode, setPlayingEpisode] = useState<{ season: number; episode: number } | null>(null)
  const prefetchedRef = useRef(false)

  const streamUrl = seriesDbId && playingEpisode
    ? `${API_BASE}/stream/series/proxy/${seriesDbId}?season=${playingEpisode.season}&episode=${playingEpisode.episode}&lang=${dubLang}`
    : null

  const handleLangChange = (l: 'pt' | 'en') => {
    setDubLang(l)
    localStorage.setItem('dubLang', l)
  }

  const { data: watchlistData } = useQuery({
    ...getWatchlistSuspenseQueryOptions(),
    enabled: !!Cookie.get('access_token'),
    retry: false,
  })

  const watchlistItems = watchlistData?.data ?? []
  const watchlistItem = watchlistItems.find((item) => item.tmdbId === Number(id))
  const isInWatchlist = !!watchlistItem

  // TMDB data hooks — must be at top to prevent TDZ
  const {
    data: series,
    isLoading: isSeriesLoading,
    isError: isSeriesError,
  } = useGetSeriesById({ options, seriesId: id })
  const { data: recommendedSeriesData, isLoading: isFetchingRecommendedMovies } =
    useGetRecommendedSeries({ options, seriesId: id })
  const { data: creditsData, isLoading: isFetchingCredits } =
    useGetSeriesCredits({ options, seriesId: id })
  const { data: episodesData, isLoading: isFetchingEpisodes } =
    useGetSeriesEpisodesBySeason({
      options,
      seriesId: id,
      seasonNumber: selectedSeason,
      enabled: true,
    })

  const { mutateAsync: addMovie } = useCreateMovie()
  const { mutateAsync: addToWatchlist } = useCreateWatchlist()
  const { mutateAsync: removeFromWatchlist } = useDeleteWatchlist()

  const ensureSeriesInDb = async (): Promise<{ id: string }> => {
    // TMDB /tv/{id} doesn't include imdb_id — fetch external_ids separately
    const extRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/external_ids`,
      options,
    )
    const extData = await extRes.json() as { imdb_id?: string }
    const imdbId = extData.imdb_id ?? undefined

    const res = await fetch(`${API_BASE}/series`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tmdbId: Number(id),
        imdbId,
        title: series!.name,
        overview: series!.overview,
        posterPath: (series as any).poster_path ?? '',
        voteAverage: series!.vote_average,
      }),
    })
    if (!res.ok) throw new Error('Failed to register series in DB')
    return res.json()
  }

  // Background prefetch: register series in DB so play is faster
  useEffect(() => {
    if (!series || prefetchedRef.current) return
    prefetchedRef.current = true

    const run = async () => {
      try {
        const dbSeries = await ensureSeriesInDb()
        setSeriesDbId(dbSeries.id)
      } catch {
        // silently ignore — will retry on play click
      }
    }
    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series])

  const handlePlayEpisode = async (season: number, episodeNumber: number) => {
    setStreamError(null)
    setIsStreamLoading(true)
    setIsPlayerOpen(true)
    setPlayingEpisode({ season, episode: episodeNumber })

    try {
      const dbId = seriesDbId ?? (await ensureSeriesInDb()).id
      if (!seriesDbId) setSeriesDbId(dbId)
    } catch (err) {
      setStreamError(err instanceof Error ? err.message : 'Erro ao buscar stream.')
    } finally {
      setIsStreamLoading(false)
    }
  }

  const handleWatchlistToggle = async () => {
    if (!series) return
    setIsWatchlistLoading(true)
    try {
      if (isInWatchlist && watchlistItem) {
        await removeFromWatchlist({ id: watchlistItem.id })
      } else {
        const movieResult = await addMovie({
          data: {
            tmdbId: Number(id),
            title: series.name,
            overview: series.overview,
            posterPath: (series as any).poster_path ?? '',
            voteAverage: series.vote_average,
          },
        })
        await addToWatchlist({ data: { movieId: movieResult.data.id } })
      }
      queryClient.invalidateQueries({ queryKey: [{ url: '/watchlist' }] })
    } finally {
      setIsWatchlistLoading(false)
    }
  }

  if (isSeriesError || !series) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <p className="text-white/40 text-sm">Erro ao carregar dados da série.</p>
      </div>
    )
  }

  const backdropImage = `https://image.tmdb.org/t/p/original/${series.backdrop_path}`
  const recommendedSeries = recommendedSeriesData?.results.map((s) => ({
    title: s.title,
    image: `https://image.tmdb.org/t/p/w500/${s.poster_path}`,
    backdropImage: `https://image.tmdb.org/t/p/original/${s.backdrop_path}`,
    vote_average: s.vote_average,
    category: 'series' as const,
    overview: s.overview,
    genre_ids: s.genre_ids,
    id: s.id,
  }))

  const modalTitle = playingEpisode
    ? `${series.name} — T${playingEpisode.season}:E${playingEpisode.episode}`
    : series.name

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
          {/* Single page-level player modal */}
          <ModalComponent
            className="!z-[99999999999] min-w-[90vw] min-h-[90vh]"
            modalTitle={modalTitle}
            open={isPlayerOpen}
            onOpenChange={(open) => {
              setIsPlayerOpen(open)
              if (!open) { setStreamError(null); setPlayingEpisode(null); setSeriesDbId(null) }
            }}
            modalBodyTemplate={
              streamError
                ? (
                  <div className="flex items-center justify-center bg-black" style={{ minHeight: '90vh' }}>
                    <p className="text-red-400 text-sm">{streamError}</p>
                  </div>
                )
                : streamUrl && seriesDbId
                ? <SeriesModalContent streamUrl={streamUrl} seriesTitle={series.name} seriesId={seriesDbId} lang={dubLang} onLangChange={handleLangChange} />
                : (
                  <div className="flex items-center justify-center bg-black" style={{ minHeight: '90vh' }}>
                    <p className="text-white/50 text-sm">Buscando stream…</p>
                  </div>
                )
            }
          />

          {/* Hero */}
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
                    disabled={isStreamLoading}
                    onClick={() => handlePlayEpisode(selectedSeason, 1)}
                    className="h-10 px-6 bg-white text-black hover:bg-white/90 cursor-pointer font-medium text-sm rounded-md"
                  >
                    <PlayCircle className="size-4" />
                    {isStreamLoading ? 'Carregando...' : 'Assistir'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={isWatchlistLoading}
                    onClick={handleWatchlistToggle}
                    className={`h-10 px-6 font-medium text-sm cursor-pointer rounded-md transition-all ${
                      isInWatchlist
                        ? 'text-primary border-primary/50 bg-primary/10 hover:bg-primary/20 hover:border-primary'
                        : 'text-white bg-transparent border-white/30 hover:border-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {isInWatchlist ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                    {isInWatchlist ? 'Na Minha Lista' : 'Adicionar à Lista'}
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
                      {item.profile_path && (
                        <img
                          className="w-full h-full object-cover"
                          alt={item.name}
                          src={`https://image.tmdb.org/t/p/w500/${item.profile_path}`}
                        />
                      )}
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
                  defaultValue={series.seasons[0]?.season_number.toString() ?? '1'}
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
                      <div
                        className="relative w-full overflow-hidden rounded-xl group cursor-pointer"
                        onClick={() => handlePlayEpisode(selectedSeason, item.episode_number)}
                      >
                        <motion.div
                          initial="hidden"
                          whileHover="visible"
                          className="relative w-full h-full"
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
                            <motion.div
                              className="mt-2 flex items-center gap-1"
                              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                              transition={{ duration: 0.2, delay: 0.15 }}
                            >
                              <PlayCircle className="size-3.5 text-white/70" />
                              <span className="text-white/70 text-xs">Assistir</span>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </div>
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
