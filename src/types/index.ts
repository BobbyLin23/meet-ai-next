import { inferRouterOutputs } from '@trpc/server'
import { AppRouter } from '@/trpc/routers/_app'

export type AgentGetOne = inferRouterOutputs<AppRouter>['agents']['getOne']
export type AgentGetMany =
  inferRouterOutputs<AppRouter>['agents']['getMany']['items']

export type MeetingGetOne = inferRouterOutputs<AppRouter>['meetings']['getOne']
export type MeetingGetMany =
  inferRouterOutputs<AppRouter>['meetings']['getMany']['items']
export enum MeetingStatus {
  Upcoming = 'upcoming',
  Active = 'active',
  Completed = 'completed',
  Processing = 'processing',
  Cancelled = 'cancelled',
}
