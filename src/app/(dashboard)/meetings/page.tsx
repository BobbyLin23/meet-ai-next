import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { SearchParams } from 'nuqs/server'

import MeetingsView, {
  MeetingsViewError,
  MeetingsViewLoading,
} from '@/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { MeetingsListHeader } from '@/app/(dashboard)/meetings/_components/meetings-list-header'
import { loadSearchParams } from '@/app/(dashboard)/meetings/params'

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
  const filters = await loadSearchParams(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    })
  )

  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading />}>
          <ErrorBoundary fallback={<MeetingsViewError />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}
