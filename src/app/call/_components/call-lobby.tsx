'use client'

import { LogInIcon } from 'lucide-react'
import Link from 'next/link'
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from '@stream-io/video-react-sdk'

import { authClient } from '@/lib/auth-client'
import { generateAvatarUri } from '@/lib/avatar'
import { Button } from '@/components/ui/button'

import '@stream-io/video-react-sdk/dist/css/styles.css'

interface Props {
  onJoin: () => void
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession()

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name || '',
          image:
            data?.user.image ||
            generateAvatarUri({
              variant: 'initials',
              seed: data?.user.name || '',
            }),
        } as StreamVideoParticipant
      }
    />
  )
}

const AllowBrowserPermission = () => {
  return (
    <p className="text-sm">
      Please grant your browser permissions for this device.
    </p>
  )
}

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks()

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState()
  const { hasBrowserPermission: hasCameraPermission } = useCameraState()

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission

  return (
    <div className="from-sidebar-accent to-sidebar flex h-full flex-col items-center justify-center bg-radial">
      <div className="flex flex-1 items-center justify-center px-8 py-4">
        <div className="bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p className="text-sm">Set up your call before joining</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasMicPermission ? DisabledVideoPreview : AllowBrowserPermission
            }
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>

          <div className="flex justify-between gap-x-2">
            <Button asChild variant="ghost">
              <Link href="/meetings">Cancel</Link>
            </Button>
            <Button onClick={onJoin}>
              <LogInIcon />
              Join call
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
