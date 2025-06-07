import { z } from 'zod'
import { eq } from 'drizzle-orm'

import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { db } from '@/db'
import { agents } from '@/db/schemas'
import { agentsInsertSchema } from '@/lib/schemas'

export const agentsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async () => {
    try {
      return await db.select().from(agents)
    } catch (e) {
      console.error('trpc agents error: ', e)
    }
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [data] = await db
        .select()
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
