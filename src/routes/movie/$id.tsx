import { createFileRoute } from '@tanstack/react-router'
import { useGetMovieById, useGetMoviesGenres, useGetRecommendedMovies } from "@/api/movies";
import { Button } from "@/components/ui/button";
import { Bookmark, PlayCircle, Star } from "lucide-react";
import { CarouselComponent } from '@/components/Carousel';

export const Route = createFileRoute('/movie/$id')({
  component: Movie,
})

function Movie() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY",
    },
  };

  const { id } = Route.useParams();

  // Buscar o filme pelo ID
  const {
    data: movie,
    isLoading: isMovieLoading,
    isError: isMovieError,
  } = useGetMovieById({ options, movieId: id });

 
   const { data:recommendedMoviesData } = useGetRecommendedMovies({ options, movieId:Number(id) })

  const recommendedMovies = recommendedMoviesData?.results.map(movie => {
    return {
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      backdropImage: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
      vote_average: movie.vote_average,
      category:'movie' as const,
      overview:movie.overview,
      genre_ids:movie.genre_ids,
      id:movie.id,
    }
  })
  
  if (isMovieLoading) {
    return <p>Carregando...</p>; 
  }

  if (isMovieError || !movie) {
    return <p>Erro ao carregar dados do filme.</p>;
  }

  const backdropImage = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;



  const formattedGenres = movie.genres
    ?.map((genre: { name:string }) => genre.name)
    .join(", ")
    .replace(/,\s*$/, "");

  return (
   <div>
     <div className="rounded-2xl h-[80vh] relative overflow-hidden transition-all duration-300 ease-out">
      <img
        src={backdropImage}
        alt={movie.title}
        className="object-cover object-center absolute inset-0 w-full "
      />
       <div
    className="absolute bottom-0 left-0 right-0 h-32"
    style={{
      background:
        'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
    }}
  />
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-end py-8 px-4 transition-opacity duration-300">
        <div className=" h-full flex flex-col justify-end ">
          <p className="font-bold text-4xl md:text-5xl">{movie.title}</p>

          <p className="text-blue-300 font-semibold mt-3">{formattedGenres}</p>
    
        <div className='mt-6'>
            <Button
              variant="default"
              size="lg"
              className="h-14 w-50 !rounded-2xl   bg-primary text-white hover:bg-blue-800 cursor-pointer"
            >
              <PlayCircle />
              Assistir
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="ml-10 h-14 w-50 mt-3 !rounded-2xl font-bold text-white  bg-transparent border-white hover:border-white/70 hover:text-white/70 hover:bg-transparent cursor-pointer"
            >
              <Bookmark />
              Adicionar a Lista
            </Button>
        </div>
        </div>

        <div className="w-full flex items-center mt-6 gap-1">
          <Star className="fill-current size-5 text-primary" />
          <p className="font-bold text-white">{movie.vote_average.toFixed(2)}</p>
          <div className="border-0.5 ml-1 border-l border-primary h-5"></div>
          <p className="font-bold text-white">Filme</p>
        </div>
      </div>
      <p className='text-white' >asd</p>
    </div>
      <div className='px-4' >
        <p className='text-xl font-bold mt-6'>Resumo</p>
        <p className='mt-4 text-gray-500' >{movie.overview}</p>
      </div>
      <div className='mx-4 mt-30 mb-10'>
        <p className='text-xl mb-6 font-bold mt-6'>Filmes semelhantes</p>
        <CarouselComponent items={recommendedMovies || []}  />
      </div>
   </div>
  );
}



