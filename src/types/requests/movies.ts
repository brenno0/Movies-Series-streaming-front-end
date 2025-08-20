import type { UseQueryOptions } from '@tanstack/react-query'
import type { IMDBResponseDTO } from '../movies'
import type { IOptions } from '.'
import type { IMDBGenresResponseDTO } from '../movies/genres'

export interface UseGetMovieByIdProps<TData = IMDBResponseDTO>
  extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  options: IOptions
  movieId: number | string
}

export interface UseGetMoviesGenresProps<TData = IMDBGenresResponseDTO>
  extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  options: IOptions
}

export interface CastMember {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  character: string
  credit_id: string
  order: number
}

interface CrewMember {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  credit_id: string
  department: string
  job: string
}

export interface IMovieCreditsResponseDTO {
  cast: CastMember[]
  crew: CrewMember[]
}
