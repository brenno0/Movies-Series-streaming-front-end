import type { UseQueryOptions } from '@tanstack/react-query'
import type { IOptions } from '.'
import type { IMDBResponseDTO } from '../movies'

export interface IGetContentByQuerySearch<TData = IMDBResponseDTO>
  extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  options: IOptions
  querySearch: string
}
export interface IMultiSearchSummary {
  adult: boolean
  backdrop_path: string
  id: number

  // Títulos (filme ou série)
  title?: string // Filmes
  original_title?: string // Filmes
  name?: string // Séries
  original_name?: string // Séries

  overview: string
  poster_path: string
  media_type: 'movie' | 'tv'
  original_language: string
  genre_ids: number[]
  popularity: number

  // Datas (dependendo do tipo)
  release_date?: string // Filmes
  first_air_date?: string // Séries

  // Info extra
  video?: boolean // Apenas em filmes normalmente
  vote_average: number
  vote_count: number
  origin_country?: string[] // Apenas séries
}

export interface ITMDBMultiResponseDTO {
  page: number
  results: IMultiSearchSummary[]
  total_pages: number
  total_results: number
}
