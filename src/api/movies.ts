import type { IMDBResponseDTO, IOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetMovies = ({ options }: { options:IOptions }) => {
  return useQuery<IMDBResponseDTO>({ 
    queryKey: ['movies'], 
    queryFn: async () => {
    const data = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR`, options).then(res => res.json())
      return data;
  } })
}

export const useGetRecommendedMovies = ({ options }: { options:IOptions }) => {
  return useQuery<IMDBResponseDTO>({ 
    queryKey: ['moviesRecommendation'], 
    queryFn: async () => {
    const data = await fetch(`https://api.themoviedb.org/3/movie/550/recommendations?language=pt-BR`, options).then(res => res.json())
      return data;
  } })
}