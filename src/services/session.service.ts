/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/utils/supabase/client'

const getActiveSession = async ({
  meetingId,
  connectedDyteMeetingId = null,
  status,
}: {
  meetingId: string
  status?: string
  connectedDyteMeetingId?: string | null
}) => {
  if (!meetingId) return null

  const query = supabaseClient
    .from('session')
    .select('*')
    .eq('status', status || 'ACTIVE')
    .eq('meeting_id', meetingId)

  if (connectedDyteMeetingId) {
    query.eq('connected_dyte_meeting_id', connectedDyteMeetingId)
  } else {
    query.is('connected_dyte_meeting_id', null)
  }

  query.single()

  return query.then(
    (res: any) => res,
    (error: any) => {
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
    .insert(dyteMeetings.map((session) => ({ ...session, status: 'LIVE' })))

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const deleteAllExistingBreakoutSessions = async ({
  meetingId,
}: {
  meetingId: string
}) => {
  const query = supabaseClient
    .from('session')
    .delete()
    .eq('meeting_id', meetingId)
    .not('connected_dyte_meeting_id', 'is', null)

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const getExistingOrCreateNewActiveSession = async ({
  meetingId,
}: {
  meetingId: string
}) => {
  if (!meetingId) return null

  const getQuery = await supabaseClient
    .from('session')
    .select('*')
    .eq('meeting_id', meetingId)
    .eq('status', 'LIVE')
    .is('connected_dyte_meeting_id', null)
    .select()
    .single()

  if (getQuery.data === null) {
    return createSession({
      meetingId,
      defaultData: null,
      status: 'LIVE',
    })
  }

  return getQuery
}

const createSession = async ({
  meetingId,
  status,
  defaultData,
}: {
  meetingId: string
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
  deleteAllExistingBreakoutSessions,
  createSession,
  createSessionForBreakouts,
  updateSession,
}
