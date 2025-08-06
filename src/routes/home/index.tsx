import { useGetMovies } from '@/api/movies';
import { useGetRecommendedSeries, useGetSeries } from '@/api/series';
import { CarouselComponent } from '@/components/Carousel';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: HomeComponent,
})

interface MoviesListResultDTO {
  embed_url:string;
  embed_url_tmdb:string;
  imdb_id: string;
  quality:string;
  title:string; 
  tmdb_id:string; 
}

interface MoviesListResponseDTO {
  pages:number;
  result:MoviesListResultDTO[]
}


function HomeComponent() {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY'
    }
  }
  
  const { data } = useGetMovies({ options });
  const { data:seriesData } = useGetSeries({ options })

  const series = seriesData?.results.map(series => {
    return {
      title: series.title,
      image: `https://image.tmdb.org/t/p/w500/${series.poster_path}`,
      vote_average: series.vote_average,
      category:'series' as const,
      overview:series.overview,
    }
  })

  const { data:recommendedMoviesData } = useGetRecommendedSeries({ options })

  const recommendedMovies = recommendedMoviesData?.results.map(recommendedMovie => {
    return {
      title: recommendedMovie.name,
      image: `https://image.tmdb.org/t/p/original/${recommendedMovie.backdrop_path}`,
      vote_average: recommendedMovie.vote_average,
      category:'movie' as const,
      overview:recommendedMovie.overview,
    }
  })
  
  const movies = data?.results.map(movie => {
    return {
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      vote_average: movie.vote_average,
      category:'movie' as const,
      overview:movie.overview,
    }
  })
  
  return (
     <div className='flex flex-wrap items-center gap-4 px-10' >

      <CarouselComponent delayInMilliseconds={5000} type='full' isRecommendationPanel={true} items={recommendedMovies || []}  />
          
      <p className='text-2xl font-bold text-left ml-5 mt-10 text-white' >Filmes Populares</p>
      <CarouselComponent items={movies || []}  />

      <div className='flex flex-wrap items-center gap-4  w-full mb-10' >
        <p className='text-2xl font-bold text-left ml-5 mt-10 text-white' >Séries Populares</p>
        <CarouselComponent items={series || []}  />
      </div>
     
     </div>
  )
}
