import type { UseQueryOptions } from '@tanstack/react-query'
import type { IMDBResponseDTO } from '../movies'
import type { IOptions } from '.'
import type { IMDBGenresResponseDTO } from '../movies/genres'

export interface UseGetSeriesByIdProps<TData = IMDBResponseDTO>
  extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  options: IOptions
  seriesId: number | string
}

export interface UseGetSeriesGenresProps<TData = IMDBGenresResponseDTO>
  extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  options: IOptions
}

export interface UseGetSeriesEpisodesBySeasonNumberProps<
  TData = IMDBResponseDTO,
> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  options: IOptions
  seriesId: number | string
  seasonNumber: number | string
}
