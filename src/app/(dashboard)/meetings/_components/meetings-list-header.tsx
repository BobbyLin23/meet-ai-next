'use client'

import { useState } from 'react'
import { PlusIcon, XCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NewMeetingDialog } from '@/app/(dashboard)/meetings/_components/new-meeting-dialog'

export const MeetingsListHeader = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <NewMeetingDialog open={open} onOpenChange={setOpen} />
      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-medium">My Meetings</h5>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">123</div>
      </div>
    </>
  )
}
