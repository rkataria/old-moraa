import { ProfileService } from './profile.service'

import { EventStatus } from '@/types/enums'
import { ICreateEventPayload } from '@/types/event.type'
import { supabaseClient } from '@/utils/supabase/client'

export type GetEventParams = {
  eventId: string
  fetchActiveSession?: boolean
}

const getEvents = async (range: { from: number; to: number }) => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (!user) return []

  const { data, count } = await supabaseClient
    .from('enrollment')
    .select('*, event(*, profile(*))', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(range.from, range.to)
  // TODO: fix this someday when the supabase ordering issue is resolved.
  // .order('start_date', {
  //   referencedTable: 'event',
  //   ascending: false,
  //   nullsFirst: true,
  // })
  // .order('updated_at', {
  //   ascending: false,
  // })
  const events = data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.map((item: any) => item.event)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => {
      // Check if both events have start_date
      if (a.start_date && b.start_date) {
        return a.start_date.localeCompare(b.start_date) * -1
      }
      if (a.start_date) {
        return -1
      }
      if (b.start_date) {
        return 1
      }

      return b.updated_at.localeCompare(a.updated_at)
    })

  return { events, count }
}

const getEvent = async ({
  eventId,
  fetchActiveSession = false,
}: GetEventParams) => {
  const { data: meeting, error } = await supabaseClient
    .from('meeting')
    .select('*, event:event_id(*)')
    .eq('event_id', eventId)
    .eq('type', 'MAIN')
    .single()

  if (error) {
    console.error('error while fetching meeting and event: ', error)

    return {
      event: null,
      contents: null,
      error,
    }
  }

  let session
  let participants

  if (eventId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await supabaseClient
      .from('enrollment')
      .select('email,event_role,id,profile(id,first_name,last_name,avatar_url)')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true })
    participants = data
  }

  if (fetchActiveSession) {
    const { data, error: _error } = await supabaseClient
      .from('session')
      .select('*')
      .eq('meeting_id', meeting.id)
      .eq('status', 'ACTIVE')
      .single()
    if (!_error) {
      session = data
    }
  }

  const profile = await ProfileService.getProfile(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (meeting.event as any).owner_id
  )

  return {
    event: meeting.event,
    participants,
    meeting,
    session,
    profile: profile.data,
  }
}

const getPublicEvent = async ({ eventId }: GetEventParams) => {
  const { data: meeting, error } = await supabaseClient
    .from('meeting')
    .select('*, event:event_id(*)')
    .eq('event_id', eventId)
    .eq('type', 'MAIN')
    .single()

  if (error) {
    console.error('error while fetching meeting and event: ', error)

    return {
      event: null,
      contents: null,
      error,
    }
  }

  let participants

  if (eventId) {
    const data = await supabaseClient.functions.invoke('get-enrollments', {
      body: { eventId },
    })
    participants = JSON.parse(data.data).enrollments
  }

  return {
    event: meeting.event,
    participants,
    meeting,
  }
}

const getEventPermissions = async ({
  eventId,
  userId,
}: {
  eventId: string
  userId: string
}) => {
  const { data } = await supabaseClient
    .from('enrollment')
    .select('role(permissions)')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()

  return {
    roles: data?.role || {},
  }
}

const createEvent = async (event: ICreateEventPayload) => {
  const { data, error } = await supabaseClient
    .from('event')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert([event] as any)
    .select()

  await new Promise((resolve) => {
    setTimeout(resolve, 500)
  })

  const { data: meeting } = await supabaseClient
    .from('meeting')
    .select()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .eq('event_id', data?.[0]?.id as any)
    .single()

  return {
    data: { ...data?.[0], meeting },
    error,
  }
}

const publishEvent = async (payload: { id: string }) =>
  supabaseClient.functions.invoke('publish-event', {
    body: payload,
  })

const updateEvent = async (payload: {
  eventId: string
  data: {
    name?: string
    description?: string
    status?: EventStatus
  }
}) => {
  const { data, error } = await supabaseClient
    .from('event')
    .update(payload.data)
    .eq('id', payload.eventId)

  return {
    data: data?.[0],
    error,
  }
}

const deleteEventParticipant = async (eventId: string, participantId: string) =>
  supabaseClient
    .from('enrollment')
    .delete()
    .eq('id', participantId)
    .eq('event_id', eventId)
    .eq('event_role', 'Participant')

const scheduleEvent = async (scheduleInfo: {
  id: string
  startDate: string
  endDate: string
}) =>
  supabaseClient.functions.invoke('schedule-event', {
    body: scheduleInfo,
  })

export const EventService = {
  getEvents,
  getEvent,
  getPublicEvent,
  getEventPermissions,
  createEvent,
  updateEvent,
  deleteEventParticipant,
  scheduleEvent,
  publishEvent,
}
