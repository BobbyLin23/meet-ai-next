'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { meetingsInsertSchema } from '@/lib/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MeetingGetOne } from '@/types'
import { useTRPC } from '@/trpc/client'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { CommandSelect } from '@/components/command-select'
import { GenerateAvatar } from '@/components/generate-avatar'
import { NewAgentDialog } from '@/app/(dashboard)/agents/_components/new-agent-dialog'

interface MeetingFormProps {
  onSuccess?: (id?: string) => void
  onCancel?: () => void
  initialValues?: MeetingGetOne
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC()

  const queryClient = useQueryClient()

  const [agentSearch, setAgentSearch] = useState<string>('')
  const [agentDialogOpen, setAgentDialogOpen] = useState(false)

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  )

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        )

        onSuccess?.(data.id)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        )

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({
              id: initialValues.id,
            })
          )
        }

        onSuccess?.(data.id)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? '',
    },
  })

  const isEdit = !!initialValues?.id
  const isPending = createMeeting.isPending || updateMeeting.isPending

  const onSubmit = form.handleSubmit(async (values) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues.id })
    } else {
      createMeeting.mutate(values)
    }
  })

  return (
    <>
      <NewAgentDialog
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Math Consultations" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="name"
            control={form.control}
          />
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GenerateAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size-6 border"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormMessage>
                  Not found what you&apos;re looking for?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setAgentDialogOpen(true)}
                  >
                    Creat new agent
                  </button>
                </FormMessage>
              </FormItem>
            )}
            name="agentId"
            control={form.control}
          />
          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => {
                  onCancel?.()
                }}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
