import type { IGetMovieByIdDTO, IMDBResponseDTO, IOptions } from "@/types";
import type { IMDBGenresResponseDTO } from "@/types/movies/genres";
import type { UseGetMovieByIdProps, UseGetMoviesGenresProps } from "@/types/requests/movies";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useGetMovies = ({ options }: { options:IOptions }) => {
  return useQuery<IMDBResponseDTO>({ 
    queryKey: ['movies'], 
    queryFn: async () => {
    const data = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR`, options).then(res => res.json())
      return data;
  } })
}

export const useGetMovieById = <TData = IGetMovieByIdDTO>({
  options,
  movieId,
  ...queryOptions
}: UseGetMovieByIdProps<TData>): UseQueryResult<TData> => {
  return useQuery<TData>({
    queryKey: ["movies", movieId],
    queryFn: async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR`,
        options
      );
      return res.json();
    },
    ...queryOptions 
  });
};

export const useGetRecommendedMovies = ({ options, movieId }: { options:IOptions, movieId:number }) => {
  return useQuery<IMDBResponseDTO>({ 
    queryKey: ['moviesRecommendation'], 
    queryFn: async () => {
    const data = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=pt-BR`, options).then(res => res.json())
      return data;
  } })
}



export const useGetMoviesGenres = <TData = IMDBGenresResponseDTO>({
  options,
  ...queryOptions
}: UseGetMoviesGenresProps<TData>): UseQueryResult<TData> => {
  return useQuery<TData>({
    queryKey: ["moviesGenres"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=pt-BR",
        options
      );
      return res.json();
    },
    ...queryOptions 
  });
};