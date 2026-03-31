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
      <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-3">
        <p className="text-white/20 text-4xl">⌕</p>
        <p className="text-white/40 text-sm">Você ainda não pesquisou nada</p>
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
    <div className="px-8 md:px-12 py-10">
      {isLoading ? (
        <div>
          <Skeleton className="w-48 h-5 rounded mb-10" />
          <div className="flex justify-start gap-4 flex-wrap">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={`key-${index}`} className="w-44 h-64 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <span className="section-label block mb-1">Resultados da busca</span>
            <p className="text-xl font-semibold text-white">
              "{querySearch}"
              <span className="text-white/30 text-base font-normal ml-3">
                {formattedContent.length} {formattedContent.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </p>
          </div>

          {formattedContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 gap-3">
              <p className="text-white/20 text-4xl">⌕</p>
              <p className="text-white/40 text-sm">Nenhum resultado encontrado para "{querySearch}"</p>
            </div>
          ) : (
            <div className="flex justify-start gap-4 flex-wrap">
              {formattedContent?.map((item, index) => (
                <div key={item.id} className="w-44 cursor-pointer">
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
          )}
        </div>
      )}
    </div>
  )
}
