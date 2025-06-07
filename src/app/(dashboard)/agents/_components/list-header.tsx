'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NewAgentDialog } from '@/app/(dashboard)/agents/_components/new-agent-dialog'

export const ListHeader = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-medium">My Agents</h5>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon />
            New Agents
          </Button>
        </div>
      </div>
      <NewAgentDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
