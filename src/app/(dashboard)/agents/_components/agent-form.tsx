'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { agentsInsertSchema } from '@/lib/schemas'
import { GenerateAvatar } from '@/components/generate-avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AgentGetOne } from '@/types'
import { useTRPC } from '@/trpc/client'
import { Textarea } from '@/components/ui/textarea'

interface AgentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialValues?: AgentGetOne
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC()

  const queryClient = useQueryClient()

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        )

        onSuccess?.()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        )

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({
              id: initialValues.id,
            })
          )
        }

        onSuccess?.()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instructions: initialValues?.instructions ?? '',
    },
  })

  const isEdit = !!initialValues?.id
  const isPending = createAgent.isPending || updateAgent.isPending

  const onSubmit = form.handleSubmit(async (values) => {
    if (isEdit) {
      updateAgent.mutate({ ...values, id: initialValues.id })
    } else {
      createAgent.mutate(values)
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <GenerateAvatar
          seed={form.getValues('name')}
          variant="botttsNeutral"
          className="size-16 border"
        />
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Math tutor" {...field} />
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
              <FormLabel>Instruction</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You are a helpful math assistant that can answer questions and help with assignments"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name="instructions"
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
  )
}
