import { APIService } from './api-service'

const getActiveSession = async ({ meetingId }: { meetingId: string }) => {
  if (!meetingId) return null

  const query = APIService.supabaseClient
    .from('session')
    .select('*')
    .eq('meeting_id', meetingId)
    .eq('status', 'ACTIVE')
    .single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const createSession = async ({ meetingId }: { meetingId: string }) => {
  if (!meetingId) return null

  const query = APIService.supabaseClient
    .from('session')
    .insert([{ meeting_id: meetingId, status: 'ACTIVE' }])
    .select()
    .single()

  return query.then(
    (res) => res,
    (error) => {
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

  const query = APIService.supabaseClient
    .from('session')
    .update({ ...sessionPayload })
    .eq('id', sessionId)
    .select()
    .single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

export const SessionService = {
  getActiveSession,
  createSession,
  updateSession,
}
