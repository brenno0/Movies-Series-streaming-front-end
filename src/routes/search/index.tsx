import { useGetContentBasedOnSearch } from '@/api/filters'
import { Card } from '@/components/FocusCards'
import { Skeleton } from '@/components/ui/skeleton'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import z from 'zod'

export const Route = createFileRoute('/search/')({
  component: Search,
  validateSearch: z.object({
    querySearch: z.string().optional(),
  }),
})

function Search() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTc1YTRiYTc4YTQwNjA1ZWQ5YzhiNWJiODhiYzg4OSIsIm5iZiI6MTc1NDQzODU3NS42MjgsInN1YiI6IjY4OTI5YmFmMTc5ZTViYzJmZTk5MTZmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C6mxUtluqqTtszlTr5oYJn2VktranOFyyNWZW6aPfoY',
    },
  }

  const [hovered, setHovered] = useState<number | null>(null)

  const { querySearch } = useSearch({ from: '/search/' })
  const navigate = useNavigate()
  const { data, isLoading } = useGetContentBasedOnSearch({
    options,
    querySearch: querySearch ?? '',
  })

  if (!querySearch)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p>Parece que você não pesquisou nada ainda</p>
      </div>
    )

  const formattedContent =
    data?.results?.map((item) => {
      return {
        ...item,
        image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
        title: (item.title || item.name) ?? 'Título não disponível',
        backdropImage: `https://image.tmdb.org/t/p/original/${item.backdrop_path}`,
        vote_average: item.vote_average ?? 0,
        category: (item.media_type === 'movie' ? 'movie' : 'series') as
          | 'movie'
          | 'series',
        overview: item.overview,
        genre_ids: item.genre_ids,
        id: item.id,
      }
    }) ?? []
  console.log('formattedContent:', formattedContent)
  console.log('formattedContent length:', formattedContent?.length)

  return (
    <div>
      {isLoading ? (
        <div>
          <Skeleton className="w-2/10 h-10 mt-30 mx-auto rounded-2xl" />
          <div className="flex justify-center gap-5 flex-wrap">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={`key-${index}`}
                className="w-1/6 gap-2 h-100 mt-30 mx-auto rounded-2xl"
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="font-bold text-2xl text-center my-10">
            Resultados encontrados
          </p>
          <div className="flex justify-center gap-5 flex-wrap">
            {formattedContent?.map((item, index) => (
              <div key={item.id} className="basis-1/6 min-w-0 cursor-pointer">
                <Card
                  card={item}
                  handleCardClick={() =>
                    item.category === 'movie'
                      ? navigate({ to: `/movie/${item.id}` })
                      : navigate({ to: `/series/${item.id}` })
                  }
                  hovered={hovered}
                  setHovered={setHovered}
                  index={index}
                  isRecommendationPanel={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
