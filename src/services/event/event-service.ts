/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateEventPayload, ScheduleEventPayload } from './event-service-types'
import { FrameStatus } from '../../types/enums'
import { APIService } from '../api-service'

export class EventService extends APIService {
  static async createEvent(eventData: CreateEventPayload) {
    const query = this.supabaseClient.from('event').insert([eventData])

    return query.then((res: any) => {
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
    let query = this.supabaseClient
      .from('event')
      .select('*')
      .eq('user_id', user?.id || '')
      .order('created_at', { ascending: true })

    if (eventId) query = query.eq('event_id', eventId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query.returns<any>()

    return query.then((res: any) => {
      if (res.error) throw res.error

      return res
    })
  }

  static async deleteEvent({ eventId }: { eventId: string }) {
    const query = this.supabaseClient.from('event').delete().eq('id', eventId)

    return query.then((res: any) => {
      if (res.error) throw res.error

      return res
    })
  }

  static async publishEvent({ eventId }: { eventId: string }) {
    const data = await this.supabaseClient
      .from('meeting')
      .select('frames')
      .eq('event_id', eventId)
      .single()
      .then((res: any) => res.data)

    if (!data || !(data.frames instanceof Array)) {
      throw new Error('Frames not found')
    }

    const query = this.supabaseClient
      .from('frame')
      .update({ status: FrameStatus.PUBLISHED })
      .in('id', data.frames)

    return query.then((res: any) => {
      if (res.error) throw res.error

      return res
    })
  }

  static async scheduleEvent(scheduleInfo: ScheduleEventPayload) {
    return this.supabaseClient.functions.invoke('schedule-event', {
      body: {
        ...scheduleInfo,
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

    return this.supabaseClient.functions.invoke<void>('invite-participants', {
      body: payload,
    })
  }

  static async deleteParticipant({
    eventId,
    participantId,
  }: {
    eventId: string
    participantId: string
  }) {
    const query = this.supabaseClient
      .from('enrollment')
      .delete()
      .eq('id', participantId)
      .eq('event_id', eventId)

    return query.then((res: any) => {
      if (res.error) throw res.error

      return res
    })
  }
}
