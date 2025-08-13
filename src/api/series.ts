/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  IGetSeriesByIdDTO,
  IMDBResponseDTO,
  IOptions,
  ISeriesCreditsResponseDTO,
  ISeriesEpisodesResponseDTO,
  ITMDBSeriesResponseDTO,
} from '@/types'
import type {
  UseGetSeriesByIdProps,
  UseGetSeriesEpisodesBySeasonNumberProps,
} from '@/types/requests/series'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'

export const useGetSeries = ({ options }: { options: IOptions }) => {
  return useQuery<ITMDBSeriesResponseDTO>({
    queryKey: ['series'],
    queryFn: async () => {
      const data = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR`,
        options,
      ).then((res) => res.json())
      return data
    },
  })
}

export const useGetRecommendedSeries = ({
  options,
  seriesId,
}: {
  options: IOptions
  seriesId: string
}) => {
  return useQuery<IMDBResponseDTO>({
    queryKey: ['seriesRecommendation'],
    queryFn: async () => {
      const data = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/recommendations?language=pt-BR`,
        options,
      ).then((res) => res.json())
      return data
    },
  })
}

export const useGetSeriesById = <TData = IGetSeriesByIdDTO>({
  options,
  seriesId,
  ...queryOptions
}: UseGetSeriesByIdProps<TData>): UseQueryResult<TData> => {
  return useQuery<TData>({
    queryKey: ['movies', seriesId],
    queryFn: async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR`,
        options,
      )
      return res.json()
    },
    ...queryOptions,
  })
}

export const useGetSeriesCredits = <TData = ISeriesCreditsResponseDTO>({
  options,
  seriesId,
  ...queryOptions
}: UseGetSeriesByIdProps<TData>): UseQueryResult<TData> => {
  return useQuery<TData>({
    queryKey: ['seriesCredits', seriesId],
    queryFn: async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR`,
        options,
      )
      return res.json()
    },
    ...queryOptions,
  })
}

export const useGetSeriesEpisodesBySeason = <
  TData = ISeriesEpisodesResponseDTO,
>({
  options,
  seriesId,
  seasonNumber,
  ...queryOptions
}: UseGetSeriesEpisodesBySeasonNumberProps<TData>): UseQueryResult<TData> => {
  return useQuery<TData>({
    queryKey: ['seriesEpisodes', seriesId, seasonNumber],
    queryFn: async ({ queryKey: [_, seriesId, seasonNumber] }) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR`,
        options,
      )
      return res.json()
    },
    ...queryOptions,
  })
}
