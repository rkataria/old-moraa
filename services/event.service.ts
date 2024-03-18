import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { ICreateEventPayload } from '@/types/event.type'

const supabase = createClientComponentClient()

export type GetEventParams = {
  eventId: string
  fetchMeetingSlides?: boolean
  fetchActiveSession?: boolean
}

const getEvents = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('enrollment')
    .select('*,event(*, profile(*))')
    .eq('user_id', user.id)
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
    ?.map((item) => item.event)
    .sort((a, b) => {
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

  return events
}

const getEvent = async ({
  eventId,
  fetchMeetingSlides = false,
  fetchActiveSession = false,
}: GetEventParams) => {
  const { data: meeting, error } = await supabase
    .from('meeting')
    .select('*, event:event_id(*)')
    .eq('event_id', eventId)
    .single()

  if (error) {
    console.error('error while fetching meeting and event: ', error)

    return {
      event: null,
      contents: null,
      error,
    }
  }

  let slides
  let session
  let participants

  if (eventId) {
    const { data } = await supabase
      .from('enrollment')
      .select('email,event_role,id')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true })
    participants = data
  }

  if (fetchMeetingSlides) {
    const { data } = await supabase
      .from('slide')
      .select('*, meeting:meeting_id(*)')
      .eq('meeting_id', meeting.id)
    slides = data
  }

  if (fetchActiveSession) {
    const { data, error: _error } = await supabase
      .from('session')
      .select('*')
      .eq('meeting_id', meeting.id)
      .eq('status', 'ACTIVE')
      .single()
    if (!_error) {
      session = data
    }
  }

  return {
    event: meeting.event,
    participants,
    meeting,
    meetingSlides: { slides },
    session,
  }
}

const createEvent = async (event: ICreateEventPayload) => {
  const { data, error } = await supabase.from('event').insert([event]).select()

  return {
    data: data?.[0],
    error,
  }
}

const deleteEventParticipant = async (eventId: string, participantId: string) =>
  supabase
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
  supabase.functions.invoke('schedule-event', {
    body: scheduleInfo,
  })

export const EventService = {
  getEvents,
  getEvent,
  createEvent,
  deleteEventParticipant,
  scheduleEvent,
}
