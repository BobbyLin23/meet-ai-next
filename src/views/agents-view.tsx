'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'
import { DataTable } from '@/app/(dashboard)/agents/_components/data-table'
import { columns } from '@/app/(dashboard)/agents/_components/columns'
import { EmptyState } from '@/components/empty-state'

export const AgentsView = () => {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions())

  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
      <DataTable columns={columns} data={data!} />
      {data?.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings.Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  )
}

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds..."
    />
  )
}

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Failed to load agents"
      description="Please try again later..."
    />
  )
}
