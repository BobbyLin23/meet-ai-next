'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'
import { DataTable } from '@/components/data-table'
import { columns } from '@/app/(dashboard)/meetings/_components/columns'
import { EmptyState } from '@/components/empty-state'

export default function MeetingsView() {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

  return (
    <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
      <DataTable columns={columns} data={data.items} />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting."
          description="Schedule a meeting to connect with others.Each meeting lets you collaborate, share ideas, and interact with participants in real time."
        />
      )}
    </div>
  )
}

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few seconds..."
    />
  )
}

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Failed to load meetings"
      description="Please try again later..."
    />
  )
}
