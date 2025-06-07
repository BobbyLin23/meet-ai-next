'use client'

import { ResponsiveDialog } from '@/components/responsive-dialog'
import { AgentForm } from '@/app/(dashboard)/agents/_components/agent-form'

interface NewAgentDialogParams {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NewAgentDialog = ({
  open,
  onOpenChange,
}: NewAgentDialogParams) => {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  )
}
