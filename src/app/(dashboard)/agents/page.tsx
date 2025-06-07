import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { getQueryClient, trpc } from '@/trpc/server'
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from '@/views/agents-view'

export default async function Page() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
