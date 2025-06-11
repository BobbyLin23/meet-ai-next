import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import MeetingsView, {
  MeetingsViewError,
  MeetingsViewLoading,
} from '@/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server'

export default function Page() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <ErrorBoundary fallback={<MeetingsViewError />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
