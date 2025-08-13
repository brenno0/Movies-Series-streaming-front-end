import type { UseQueryOptions } from '@tanstack/react-query'
import type { IOptions } from '.'
import type { IMDBResponseDTO } from '../movies'

export interface IGetContentByQuerySearch<TData = IMDBResponseDTO>
  extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  options: IOptions
  querySearch: string
}
