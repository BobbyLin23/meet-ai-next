import { z } from 'zod'
import { and, count, desc, eq, getTableColumns, ilike } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { db } from '@/db'
import { agents } from '@/db/schemas'
import { agentsInsertSchema, agentsUpdateSchema } from '@/lib/schemas'
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '@/constants'

export const agentsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: db.$count(agents, eq(agents.userId, ctx.auth.user.id)),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            input?.search ? ilike(agents.name, `%${input.search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize)
      const [total] = await db
        .select({
          count: count(),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            input?.search ? ilike(agents.name, `%${input.search}%`) : undefined
          )
        )

      const totalPages = Math.ceil(total.count / input.pageSize)

      return {
        items: data,
        total: total.count,
        totalPages,
      }
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const [data] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: db.$count(agents, eq(agents.userId, ctx.auth.user.id)),
        })
        .from(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        )

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Not Found',
        })
      }

      return data
    }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning()

      return createdAgent
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [data] = await db
        .delete(agents)
        .where(
          and(eq(agents.userId, ctx.auth.user.id), eq(agents.id, input.id))
        )
        .returning()

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Not Found',
        })
      }

      return data
    }),
  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(
          and(eq(agents.userId, ctx.auth.user.id), eq(agents.id, input.id))
        )
        .returning()

      if (!updatedAgent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Not Found',
        })
      }

      return updatedAgent
    }),
})
