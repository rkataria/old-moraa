import { CreateEventPayload, ScheduleEventPayload } from './event-service-types'
import { APIService } from '../api-service'
import { FrameStatus } from '../types/enums'

export class EventService extends APIService {
  static async createEvent(eventData: CreateEventPayload) {
    const query = APIService.supabaseClient.from('event').insert([eventData])

    return query.then((res) => {
      if (res.error) throw res.error

      return res
    })
  }

  static async getEvents({
    eventId,
  }: {
    eventId?: string
  } = {}) {
    const user = await APIService.getAuthenticatedUser()
    let query = APIService.supabaseClient
      .from('event')
      .select('*')
      .eq('user_id', user?.id || '')
      .order('created_at', { ascending: true })

    if (eventId) query = query.eq('event_id', eventId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query.returns<any>()

    return query.then((res) => {
      if (res.error) throw res.error

      return res
    })
  }

  static async deleteEvent({ eventId }: { eventId: string }) {
    const query = APIService.supabaseClient
      .from('event')
      .delete()
      .eq('id', eventId)

    return query.then((res) => {
      if (res.error) throw res.error

      return res
    })
  }

  static async publishEvent({ eventId }: { eventId: string }) {
    const data = await APIService.supabaseClient
      .from('meeting')
      .select('frames')
      .eq('event_id', eventId)
      .single()
      .then((res) => res.data)

    if (!data || !(data.frames instanceof Array)) {
      throw new Error('Frames not found')
    }

    const query = APIService.supabaseClient
      .from('frame')
      .update({ status: FrameStatus.PUBLISHED })
      .in('id', data.frames)

    return query.then((res) => {
      if (res.error) throw res.error

      return res
    })
  }

  static async scheduleEvent(scheduleInfo: ScheduleEventPayload) {
    return APIService.supabaseClient.functions.invoke('schedule-event', {
      body: {
        ...scheduleInfo,
        startDate: scheduleInfo.start_date,
        endDate: scheduleInfo.end_date,
      },
    })
  }

  static async addParticipant({
    eventId,
    participants,
  }: {
    eventId: string
    participants: { email: string; role: string }[]
  }) {
    const payload = JSON.stringify({
      eventId,
      participants: participants.map((participant) => ({
        email: participant.email,
        role: participant.role,
      })),
    })

    return APIService.supabaseClient.functions.invoke<void>(
      'invite-participants',
      {
        body: payload,
      }
    )
  }

  static async deleteParticipant({
    eventId,
    participantId,
  }: {
    eventId: string
    participantId: string
  }) {
    const query = APIService.supabaseClient
      .from('enrollment')
      .delete()
      .eq('id', participantId)
      .eq('event_id', eventId)

    return query.then((res) => {
      if (res.error) throw res.error

      return res
    })
  }
}
