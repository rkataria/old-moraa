/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/utils/supabase/client'

const getActiveSession = async ({
  meetingId,
  status,
}: {
  meetingId: string
  status?: string
}) => {
  if (!meetingId) return null

  const query = supabaseClient
    .from('session')
    .select('*')
    .eq('status', status || 'ACTIVE')
    .eq('meeting_id', meetingId)
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

/**
 * This function takes the meeting ID and returns the session for that meeting
 * If the session does not exist then creates a new session and then returns it.
 * @param meetingId ID of the meeting
 * @return SessionModel
 */
const getExistingOrCreateNewActiveSession = async ({
  meetingId,
}: {
  meetingId: string
}) => {
  if (!meetingId) return null

  const query = supabaseClient
    .from('session')
    .upsert({
      id: meetingId,
      meeting_id: meetingId,
      status: 'LIVE',
    })
    .select()
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
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
  createSession,
  updateSession,
}
