import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { useMeetingsFilter } from '@/hooks/use-meetings-filter'

export const MeetingsSearchFilter = () => {
  const [filter, setFilter] = useMeetingsFilter()

  return (
    <div className="relative">
      <Input
        placeholder="Filter By Name"
        className="h-9 w-[200px] bg-white pl-7"
        value={filter.search}
        onChange={(e) => setFilter({ search: e.target.value })}
      />
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
    </div>
  )
}
