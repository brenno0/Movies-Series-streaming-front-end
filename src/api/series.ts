import type { IMDBResponseDTO, IOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetSeries = ({ options }: { options:IOptions }) => {
  return useQuery<IMDBResponseDTO>({ 
    queryKey: ['series'], 
    queryFn: async () => {
    const data = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=d175a4ba78a40605ed9c8b5bb88bc889&language=pt-BR`, options).then(res => res.json())
      return data;
  } })
}

export const useGetRecommendedSeries = ({ options }: { options:IOptions }) => {
  return useQuery<IMDBResponseDTO>({ 
    queryKey: ['seriesRecommendation'], 
    queryFn: async () => {
    const data = await fetch(`https://api.themoviedb.org/3/tv/1399/recommendations?language=pt-BR`, options).then(res => res.json())
      return data;
  } })
}