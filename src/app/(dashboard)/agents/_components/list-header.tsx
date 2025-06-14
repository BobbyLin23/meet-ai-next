'use client'

import { useState } from 'react'
import { PlusIcon, XCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NewAgentDialog } from '@/app/(dashboard)/agents/_components/new-agent-dialog'
import { useAgentsFilter } from '@/hooks/use-agents-filter'
import { AgentsSearchFilter } from '@/app/(dashboard)/agents/_components/agents-search-filter'
import { DEFAULT_PAGE } from '@/constants'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export const ListHeader = () => {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useAgentsFilter()

  const isAnyFilterModified = !!filters.search

  const onClearFilters = () => {
    setFilters({
      search: '',
      page: DEFAULT_PAGE,
    })
  }

  return (
    <>
      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-medium">My Agents</h5>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon />
            New Agents
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <AgentsSearchFilter />
            {isAnyFilterModified && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <XCircleIcon />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <NewAgentDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
