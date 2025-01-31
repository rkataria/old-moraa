/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionModel } from '@/types/models'
import { supabaseClient } from '@/utils/supabase/client'

const getActiveSession = async ({
  meetingId,
  connectedDyteMeetingId,
  status,
}: {
  meetingId?: string
  connectedDyteMeetingId?: string
  status?: string
}) => {
  if (!meetingId && !connectedDyteMeetingId) {
    throw new Error('meetingId OR connectedDyteMeetingId is required')
  }

  const query = supabaseClient
    .from('session')
    .select('*')
    .eq('status', status || 'ACTIVE')

  if (meetingId) {
    query.eq('meeting_id', meetingId)
  }

  if (connectedDyteMeetingId) {
    query.eq('connected_dyte_meeting_id', connectedDyteMeetingId)
  }

  return query.single().then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const createSessionForBreakouts = async ({
  dyteMeetings,
}: {
  dyteMeetings: Array<{
    connected_dyte_meeting_id: string
    meeting_id: string
    data: object
  }>
}) => {
  const query = supabaseClient
    .from('session')
    .insert(
      dyteMeetings.map((session) => ({ ...session, status: 'ACTIVE' })) as any
    )

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const getExistingOrCreateNewActiveSession = async ({
  meetingId,
  dyteMeetingId,
  defaultData = null,
}: {
  meetingId?: string
  dyteMeetingId?: string
  defaultData?: object | null
}) => {
  if (!meetingId && !dyteMeetingId) throw new Error('Session not found')

  const { data, error } = await supabaseClient.rpc('get_or_create_session', {
    meeting_id_input: meetingId as string,
    dyte_meeting_id_input: dyteMeetingId as string,
    default_data_input: defaultData as any,
  })

  if (error || !data) {
    console.error('Error fetching or inserting session:', error)

    throw new Error('Session not found')
  }

  return { data } as { data: SessionModel }
}

const createSession = async ({
  meetingId,
  dyteMeetingId,
  status,
  defaultData,
}: {
  meetingId?: string
  dyteMeetingId?: string
  status?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultData?: any
}) => {
  if (!meetingId) return null

  const query = supabaseClient
    .from('session')
    .insert([
      {
        meeting_id: meetingId,
        connected_dyte_meeting_id: dyteMeetingId,
        status: status || 'ACTIVE',
        data: defaultData || {},
      },
    ])
    .select()
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const updateSession = async ({
  sessionPayload,
  sessionId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessionPayload: any
  sessionId: string
}) => {
  if (!sessionId) return null

  const query = supabaseClient
    .from('session')
    .update({ ...sessionPayload })
    .eq('id', sessionId)
    .select()
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

export const SessionService = {
  getActiveSession,
  getExistingOrCreateNewActiveSession,
  createSession,
  createSessionForBreakouts,
  updateSession,
}
