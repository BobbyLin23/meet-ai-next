import { createTRPCRouter } from '../init'
import { agentsRouter } from './agents'
import { meetingsRouter } from '@/trpc/routers/meetings'

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
