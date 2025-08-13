import { useQueryState } from 'nuqs'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'

export const QueryParamInput = ({
  ...props
}: React.ComponentProps<'input'>) => {
  const [querySearch, setQuerySearch] = useQueryState('querySearch')

  return (
    <Input
      {...props}
      startIcon={<Search size={18} />}
      value={querySearch ?? ''}
      placeholder="Buscar por filmes/series"
      onChange={(e) => setQuerySearch(e.target.value)}
    />
  )
}
