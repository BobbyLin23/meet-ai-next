'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'

export default function MeetingsView() {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

  return <div>{JSON.stringify(data)}</div>
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
