'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { VideoIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useTRPC } from '@/trpc/client'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'
import { AgentIdViewHeader } from '@/app/(dashboard)/agents/[agentId]/_components/agent-id-view-header'
import { GenerateAvatar } from '@/components/generate-avatar'
import { Badge } from '@/components/ui/badge'
import { useConfirm } from '@/hooks/use-confirm'
import { UpdateAgentDialog } from '@/app/(dashboard)/agents/_components/update-agent-dialog'

interface AgentIdViewProps {
  agentId: string
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false)

  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  )

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
        router.push('/agents')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    'Are you sure?',
    `The following  action will remove ${data.meetingCount} associated meetings`
  )

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove()

    if (!ok) return

    await removeAgent.mutateAsync({
      id: agentId,
    })
  }

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      />
      <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />
        <div className="rounded-lg border bg-white">
          <div className="col-span-5 flex flex-col gap-y-5 px-4 py-5">
            <div className="flex items-center gap-x-3">
              <GenerateAvatar
                seed={data.name}
                variant="botttsNeutral"
                className="size-10"
              />
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&_svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              {data.meetingCount}{' '}
              {data.meetingCount === 1 ? 'meeting' : 'meetings'}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-neutral-800">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds..."
    />
  )
}

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Failed to load agent"
      description="Please try again later..."
    />
  )
}
