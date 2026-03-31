/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    useNavigate: vi.fn(),

    createFileRoute: vi
      .fn()
      .mockImplementation(() => () => ({ useParams: () => ({ id: '123' }) })),
  }
})

vi.mock('@/components/FocusCards', () => ({
  Card: ({ card, handleCardClick, ...props }: any) => (
    <div
      data-testid="recommended-movies-card"
      data-movie-id={card.id} // ← Para verificar o ID correto
      onClick={handleCardClick}
      role="button"
      {...props}
    >
      {card.title}
    </div>
  ),
}))

vi.mock('@/components/QueryParamInput', () => ({
  QueryParamInput: (props: any) => (
    <input {...props} data-testid="query-input" />
  ),
}))

vi.mock('@/api/movies')
vi.mock('@/api/series')

vi.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: vi.fn(() => [
    vi.fn(), // carouselRef - a ref function
    {
      // api object with common methods
      scrollNext: vi.fn(),
      scrollPrev: vi.fn(),
      canScrollNext: vi.fn(() => true),
      canScrollPrev: vi.fn(() => false),
      scrollTo: vi.fn(),
      selectedScrollSnap: vi.fn(() => 0),
      scrollSnapList: vi.fn(() => [0, 1, 2]),
      on: vi.fn(),
      off: vi.fn(),
    },
  ]),
}))
