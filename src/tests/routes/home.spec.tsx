/* eslint-disable @typescript-eslint/no-explicit-any */
// src/tests/routes/home.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, beforeEach } from 'vitest'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { HomeComponent } from '@/routes/home/'
import * as moviesApi from '@/api/movies'
import * as seriesApi from '@/api/series'
import * as router from '@tanstack/react-router'

// Mocks

vi.mock('@nuqs/react', () => ({
  NuqsAdapter: ({ children }: any) => <>{children}</>,
}))

// Dados simulados
const mockMovies = {
  results: [
    {
      id: 1,
      title: 'Movie 1',
      poster_path: 'poster1.jpg',
      backdrop_path: 'backdrop1.jpg',
      vote_average: 8.5,
      genre_ids: [],
      overview: 'Overview 1',
    },
    {
      id: 2,
      title: 'Movie 2',
      poster_path: 'poster2.jpg',
      backdrop_path: 'backdrop2.jpg',
      vote_average: 7.0,
      genre_ids: [],
      overview: 'Overview 2',
    },
  ],
}

const mockSeries = {
  results: [
    {
      id: 101,
      name: 'Series 1',
      poster_path: 'poster101.jpg',
      backdrop_path: 'backdrop101.jpg',
      vote_average: 9.0,
      genre_ids: [],
      overview: 'Overview 101',
    },
  ],
}

describe('HomeComponent', () => {
  let navigateMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    ;(moviesApi.useGetMovies as any).mockReturnValue({
      data: mockMovies,
      isPending: false,
    })
    ;(seriesApi.useGetSeries as any).mockReturnValue({
      data: mockSeries,
      isPending: false,
    })

    navigateMock = vi.fn()
    ;(router.useNavigate as any).mockReturnValue(navigateMock)

    render(
      <NuqsAdapter>
        <HomeComponent />
      </NuqsAdapter>,
    )
  })

  it('renders movies and series carousels when data is loaded', () => {
    expect(screen.getByText('Filmes Populares')).toBeInTheDocument()
    expect(screen.getByText('Séries Populares')).toBeInTheDocument()

    expect(screen.getAllByText('Movie 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Movie 2').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Series 1').length).toBeGreaterThan(0)
  })

  it('navigates when Enter is pressed in the search input', () => {
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/search',
      search: { querySearch: '' }, // ajuste se quiser simular input.value
    })
  })

  it('navigates to movie or series when card is clicked', () => {
    // Get the first occurrence of each movie/series
    const movieCard = screen.getAllByText('Movie 1')[0]
    fireEvent.click(movieCard)
    expect(navigateMock).toHaveBeenCalledWith({ to: '/movie/1' })

    const seriesCard = screen.getAllByText('Series 1')[0]
    fireEvent.click(seriesCard)
    expect(navigateMock).toHaveBeenCalledWith({ to: '/series/101' })
  })

  it('renders loading state when fetching data', () => {
    // Re-render apenas para simular loading
    ;(moviesApi.useGetMovies as any).mockReturnValue({
      data: null,
      isPending: true,
    })
    ;(seriesApi.useGetSeries as any).mockReturnValue({
      data: null,
      isPending: true,
    })

    render(
      <NuqsAdapter>
        <HomeComponent />
      </NuqsAdapter>,
    )

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
