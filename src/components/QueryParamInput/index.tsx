import { useQueryState } from 'nuqs'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export const QueryParamInput = ({
  ...props
}: React.ComponentProps<'input'>) => {
  const [querySearch, setQuerySearch] = useQueryState('querySearch')

  const navigate = useNavigate()

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      navigate({
        to: `/search`,
        search: {
          querySearch: e.currentTarget.value,
        },
      })
    }
  }

  return (
    <Input
      {...props}
      startIcon={<Search size={18} />}
      value={querySearch ?? ''}
      placeholder="Buscar por filmes/series"
      onChange={(e) => setQuerySearch(e.target.value)}
      onKeyDown={props.onKeyDown || onKeyDown}
    />
  )
}
