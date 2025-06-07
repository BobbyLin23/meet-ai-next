import { z } from 'zod'
import { and, count, desc, eq, getTableColumns, ilike } from 'drizzle-orm'

import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { db } from '@/db'
import { agents } from '@/db/schemas'
import { agentsInsertSchema } from '@/lib/schemas'
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
        .where(eq(agents.id, input.id))

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
})
