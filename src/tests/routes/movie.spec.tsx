/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { Movie } from '@/routes/movie/$id'
import { vi } from 'vitest'
import * as moviesApi from '@/api/movies'
import * as router from '@tanstack/react-router'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Mocks
vi.mock('@tanstack/react-router', () => ({
  Route: {
    useParams: () => ({ id: '123' }),
  },
  useNavigate: vi.fn(),
  createFileRoute: vi.fn().mockImplementation(() => () => ({
    useParams: () => ({ id: '123' }),
  })),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

const navigateSpy = vi.fn()

vi.spyOn(router, 'useNavigate').mockReturnValue(navigateSpy)

vi.mock('@/api/movies', () => ({
  useGetMovieById: vi.fn(),
  useGetRecommendedMovies: vi.fn(),
  useGetMovieCredits: vi.fn(),
}))

vi.mock('@/gen', () => ({
  useCreateMovie: vi.fn().mockReturnValue({ mutateAsync: vi.fn() }),
  useCreateWatchlist: vi.fn().mockReturnValue({ mutateAsync: vi.fn() }),
  useDeleteWatchlist: vi.fn().mockReturnValue({ mutateAsync: vi.fn() }),
}))

vi.mock('@/gen/hooks/useGetWatchlistSuspense', () => ({
  getWatchlistSuspenseQueryOptions: vi.fn().mockReturnValue({
    queryKey: ['watchlist'],
    queryFn: () => Promise.resolve({ data: [] }),
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const mockMovie = {
  title: 'Inception',
  vote_average: 8.8,
  release_date: '2010-07-16',
  genres: [{ id: 1, name: 'Action' }],
  overview: 'A thief who steals corporate secrets...',
  imdb_id: 'tt1375666',
  backdrop_path: '/backdrop.jpg',
}

const mockCredits = {
  cast: [
    {
      id: 1,
      name: 'Leonardo DiCaprio',
      character: 'Cobb',
      profile_path: '/leo.jpg',
    },
  ],
}

const mockRecommendations = {
  results: [
    {
      title: 'Tenet',
      poster_path: '/tenet.jpg',
      backdrop_path: '/tenet-bg.jpg',
      vote_average: 7.5,
      category: 'movie',
      overview: 'Time-bending story',
      genre_ids: [1],
      id: 456,
    },
  ],
}

let navigateMock: ReturnType<typeof vi.fn>

describe('Movie page', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    navigateMock = vi.fn()
    ;(router.useNavigate as any).mockReturnValue(navigateMock)
    ;(moviesApi.useGetMovieById as any).mockReturnValue({
      data: mockMovie,
      isLoading: false,
      isError: false,
    })
    ;(moviesApi.useGetMovieCredits as any).mockReturnValue({
      data: mockCredits,
      isLoading: false,
    })
    ;(moviesApi.useGetRecommendedMovies as any).mockReturnValue({
      data: mockRecommendations,
    })
    render(<Movie />, { wrapper: createWrapper() })
  })

  it('renders correctly', () => {
    expect(screen.getByText('Inception')).toBeInTheDocument()
  })

  it('redirects the user when recommended card are clicked', async () => {
    const user = userEvent.setup()
    const card = await screen.findByTestId('recommended-movies-card')

    await user.click(card)

    expect(navigateMock).toHaveBeenCalledWith({ to: '/movie/456' })
  })
})

describe('Movie page with loading', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    navigateMock = vi.fn()
    ;(router.useNavigate as any).mockReturnValue(navigateMock)
    ;(moviesApi.useGetMovieById as any).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    render(<Movie />, { wrapper: createWrapper() })
  })

  it('renders the skeleton when movies are loading', async () => {
    const skeletons = await screen.findAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('Movie page with error', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    navigateMock = vi.fn()
    ;(router.useNavigate as any).mockReturnValue(navigateMock)
    ;(moviesApi.useGetMovieById as any).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    })

    render(<Movie />, { wrapper: createWrapper() })
  })

  it('renders error message when movie loading fails', async () => {
    const errorMessage = await screen.findByText(
      'Erro ao carregar dados do filme.',
    )
    expect(errorMessage).toBeInTheDocument()
  })
})
