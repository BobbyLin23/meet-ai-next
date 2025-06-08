import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { SearchParams } from 'nuqs'

import { getQueryClient, trpc } from '@/trpc/server'
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from '@/views/agents-view'
import { ListHeader } from '@/app/(dashboard)/agents/_components/list-header'
import { loadSearchParams } from '@/app/(dashboard)/agents/params'

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
  const params = await loadSearchParams(searchParams)

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({ ...params })
  )

  return (
    <>
      <ListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}
