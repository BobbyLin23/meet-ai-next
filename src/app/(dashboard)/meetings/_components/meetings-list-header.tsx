'use client'

import { useState } from 'react'
import { PlusIcon, XCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NewMeetingDialog } from '@/app/(dashboard)/meetings/_components/new-meeting-dialog'
import { MeetingsSearchFilter } from '@/app/(dashboard)/meetings/_components/meetings-search-filter'
import { StatusFilter } from '@/app/(dashboard)/meetings/_components/status-filter'
import { AgentIdFilter } from '@/app/(dashboard)/meetings/_components/agent-id-filter'
import { useMeetingsFilter } from '@/hooks/use-meetings-filter'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { DEFAULT_PAGE } from '@/constants'

export const MeetingsListHeader = () => {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useMeetingsFilter()

  const isAnyFilterModified =
    !!filters.search || !!filters.status || !!filters.agentId

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: '',
      search: '',
      page: DEFAULT_PAGE,
    })
  }

  return (
    <>
      <NewMeetingDialog open={open} onOpenChange={setOpen} />
      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-medium">My Meetings</h5>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button variant="outline" onClick={onClearFilters}>
                <XCircleIcon className="size-4" />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  )
}
