'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useTRPC } from '@/trpc/client'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'
import { MeetingIdViewHeader } from '@/app/(dashboard)/meetings/[meetingId]/_components/meeting-id-view-header'
import { useConfirm } from '@/hooks/use-confirm'
import { UpdateMeetingDialog } from '@/app/(dashboard)/meetings/[meetingId]/_components/update-meeting-dialog'
import { UpcomingState } from '@/app/(dashboard)/meetings/[meetingId]/_components/upcoming-state'
import { ActiveState } from '@/app/(dashboard)/meetings/[meetingId]/_components/active-state'
import { CancelledState } from '@/app/(dashboard)/meetings/[meetingId]/_components/cancelled-state'
import { ProcessingState } from '@/app/(dashboard)/meetings/[meetingId]/_components/processing-state'

export const MeetingIdView = ({ meetingId }: { meetingId: string }) => {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  )

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false)

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    'Are you sure you want to delete meeting?',
    'The following meetings will be deleted.'
  )

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
        router.push('/meetings')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove()

    if (!ok) return

    await removeMeeting.mutateAsync({ id: meetingId })
  }

  const isActive = data.status === 'active'
  const isUpcoming = data.status === 'upcoming'
  const isCancelled = data.status === 'cancelled'
  const isCompleted = data.status === 'completed'
  const isProcessing = data.status === 'processing'

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={() => handleRemoveMeeting()}
        />
        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isCompleted && <div>Completed</div>}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={() => {}}
            isCancelling={false}
          />
        )}
      </div>
    </>
  )
}

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds..."
    />
  )
}

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Failed to load meeting"
      description="Please try again later..."
    />
  )
}
