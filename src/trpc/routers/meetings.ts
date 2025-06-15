import { z } from 'zod'
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { db } from '@/db'
import { agents, meetings } from '@/db/schemas'
import { meetingsInsertSchema, meetingsUpdateSchema } from '@/lib/schemas'
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '@/constants'
import { MeetingStatus } from '@/types'
import { streamVideo } from '@/lib/stream-video'
import { generateAvatarUri } from '@/lib/avatar'

export const meetingsRouter = createTRPCRouter({
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
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Cancelled,
            MeetingStatus.Processing,
            MeetingStatus.Completed,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            'duration'
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            input.search
              ? ilike(meetings.name, `%${input.search}%`)
              : undefined,
            input.status ? eq(input.status, meetings.status) : undefined,
            input.agentId ? eq(meetings.agentId, agents.id) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize)
      const [total] = await db
        .select({
          count: count(),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            input?.search
              ? ilike(meetings.name, `%${input.search}%`)
              : undefined
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
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            'duration'
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
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
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning()

      const call = streamVideo.video.call('default', createdMeeting.id)
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          },
          settings_override: {
            transcription: {
              language: 'en',
              mode: 'auto-on',
              closed_caption_mode: 'auto-on',
            },
            recording: {
              mode: 'auto-on',
              quality: '1080p',
            },
          },
        },
      })

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId))

      if (!existingAgent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Not Found',
        })
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: 'user',
          image: generateAvatarUri({
            seed: existingAgent.name,
            variant: 'botttsNeutral',
          }),
        },
      ])

      return createdMeeting
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [data] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, input.id))
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
    .input(meetingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(
          and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, input.id))
        )
        .returning()

      if (!updatedMeeting) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Not Found',
        })
      }

      return updatedMeeting
    }),
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: 'admin',
        image:
          ctx.auth.user.image ??
          generateAvatarUri({ seed: ctx.auth.user.name, variant: 'initials' }),
      },
    ])

    const expirationTime = Math.floor(Date.now() / 1000) + 3600
    const issuedAt = Math.floor(Date.now() / 1000) - 60

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      expiration: expirationTime,
      validity_in_seconds: issuedAt,
    })

    return token
  }),
})
