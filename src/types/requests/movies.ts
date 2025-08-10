import type { UseQueryOptions } from "@tanstack/react-query";
import type { IMDBResponseDTO } from "../movies";
import type { IOptions } from ".";
import type { IMDBGenresResponseDTO } from "../movies/genres";

export interface UseGetMovieByIdProps<TData = IMDBResponseDTO>
  extends Omit<UseQueryOptions<TData>, "queryKey" | "queryFn"> {
  options: IOptions;
  movieId: number | string;
}

export interface UseGetMoviesGenresProps<TData = IMDBGenresResponseDTO>
  extends Omit<UseQueryOptions<TData>, "queryKey" | "queryFn"> {
  options: IOptions;
}