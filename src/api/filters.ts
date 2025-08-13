import type { ISeriesEpisodesResponseDTO } from '@/types'
import type { IGetContentByQuerySearch } from '@/types/requests/filters'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'

export const useGetSeriesEpisodesBySeason = <
  TData = ISeriesEpisodesResponseDTO,
>({
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
