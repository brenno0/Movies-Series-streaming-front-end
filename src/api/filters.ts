/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  IGetContentByQuerySearch,
  ITMDBMultiResponseDTO,
} from '@/types/requests/filters'
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
