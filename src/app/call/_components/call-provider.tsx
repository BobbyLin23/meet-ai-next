import { Loader2Icon } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { CallConnect } from '@/app/call/_components/call-connect'
import { generateAvatarUri } from '@/lib/avatar'

interface Props {
  meetingId: string
  meetingName: string
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
  const { data, isPending } = authClient.useSession()

  if (!data || isPending) {
    return (
      <div className="from-sidebar-accent to-sidebar flex h-screen items-center justify-center bg-radial">
        <Loader2Icon className="size-6 animate-spin text-white" />
      </div>
    )
  }

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={
        data.user.image ??
        generateAvatarUri({ seed: data.user.name, variant: 'initials' })
      }
    />
  )
}
