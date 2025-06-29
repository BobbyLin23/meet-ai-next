import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getQueryClient, trpc } from '@/trpc/server'
import {
  MeetingIdView,
  MeetingIdViewError,
  MeetingIdViewLoading,
} from '@/views/meeting-id-view'

interface Props {
  params: Promise<{
    meetingId: string
  }>
}

export default async function Page({ params }: Props) {
  const { meetingId } = await params

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingIdViewLoading />}>
        <ErrorBoundary fallback={<MeetingIdViewError />}>
          <MeetingIdView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
