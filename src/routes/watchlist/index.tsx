import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useGetWatchlistSuspense } from '@/gen/hooks/useGetWatchlistSuspense'
import { useDeleteWatchlist } from '@/gen'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2, Star, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/watchlist/')({
  component: WatchlistPage,
})

function WatchlistContent() {
  const { data: watchlistData } = useGetWatchlistSuspense()
  const { mutateAsync: removeFromWatchlist } = useDeleteWatchlist()
  const queryClient = useQueryClient()

  const items = watchlistData?.data ?? []

  const handleRemove = async (id: string) => {
    await removeFromWatchlist({ id })
    queryClient.invalidateQueries({ queryKey: [{ url: '/watchlist' }] })
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-white/40 text-lg">Sua lista está vazia</p>
        <Link to="/home">
          <Button variant="outline" className="border-white/20 text-white/60 hover:text-white hover:border-white/40">
            Explorar conteúdo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <div key={item.id} className="relative group cursor-pointer">
          <img
            src={`https://image.tmdb.org/t/p/w500/${item.posterPath}`}
            alt={item.title}
            className="w-full aspect-[2/3] object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 rounded-xl flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => handleRemove(item.id)}
              className="self-end w-7 h-7 rounded-md bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-colors"
            >
              <Trash2 className="size-3.5" />
            </button>
            <div>
              <p className="text-white text-sm font-medium leading-tight line-clamp-2">
                {item.title}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="size-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white/60 text-xs">
                  {item.voteAverage.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function WatchlistPage() {
  return (
    <div className="px-8 md:px-12 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/home"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm">Voltar</span>
        </Link>
        <div>
          <span className="section-label block mb-1">Seu conteúdo</span>
          <h1 className="text-2xl font-semibold text-white">Minha Lista</h1>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[2/3] rounded-xl" />
            ))}
          </div>
        }
      >
        <WatchlistContent />
      </Suspense>
    </div>
  )
}
