import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { getQueryClient, trpc } from '@/trpc/server'
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from '@/views/agents-view'
import { ListHeader } from '@/app/(dashboard)/agents/_components/list-header'
import { auth } from '@/lib/auth'

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect('/sign-in')
  }

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

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
