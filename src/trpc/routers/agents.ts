import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { db } from '@/db'
import { agents } from '@/db/schemas'

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    try {
      return await db.select().from(agents)
    } catch (e) {
      console.error('trpc agents error: ', e)
    }
  }),
})
