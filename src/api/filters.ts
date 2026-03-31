/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  IGetContentByQuerySearch,
  ITMDBMultiResponseDTO,
} from '@/types/requests/filters'
import type { IMDBResponseDTO, IOptions, ITMDBSeriesResponseDTO } from '@/types'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'

export const useGetContentBasedOnSearch = <TData = ITMDBMultiResponseDTO>({
  options,
  querySearch,
  ...queryOptions
}: IGetContentByQuerySearch<TData>): UseQueryResult<TData> => {
  return useQuery<TData>({
    queryKey: ['filterContent', querySearch],
    queryFn: async ({ queryKey: [_, querySearch] }) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR&query=${querySearch}&page=1&include_adult=false`,
        options,
      )
      return res.json()
    },
    ...queryOptions,
  })
}

export const useDiscoverMovies = ({
  options,
  genreId,
}: {
  options: IOptions
  genreId?: number
}) => {
  return useQuery<IMDBResponseDTO>({
    queryKey: ['discoverMovies', genreId],
    queryFn: async () => {
      const genreParam = genreId ? `&with_genres=${genreId}` : ''
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR&sort_by=popularity.desc${genreParam}`,
        options,
      )
      return res.json()
    },
  })
}

export const useDiscoverSeries = ({
  options,
  genreId,
}: {
  options: IOptions
  genreId?: number
}) => {
  return useQuery<ITMDBSeriesResponseDTO>({
    queryKey: ['discoverSeries', genreId],
    queryFn: async () => {
      const genreParam = genreId ? `&with_genres=${genreId}` : ''
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR&sort_by=popularity.desc${genreParam}`,
        options,
      )
      return res.json()
    },
  })
}
