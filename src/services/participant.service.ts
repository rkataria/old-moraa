/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/utils/supabase/client'

const getOrCreateNewParticipant = async ({
  enrollmentId,
  sessionId,
}: {
  sessionId: string
  enrollmentId: string
}) => {
  const existingParticipantQuery = await supabaseClient
    .from('participant')
    .select()
    .eq('session_id', sessionId)
    .eq('enrollment_id', enrollmentId)
    .single()

  if (existingParticipantQuery.data === null) {
    return createParticipant({ enrollmentId, sessionId })
  }

  return existingParticipantQuery
}

const createParticipant = ({
  enrollmentId,
  sessionId,
}: {
  sessionId: string
  enrollmentId: string
}) => {
  const query = supabaseClient
    .from('participant')
    .insert([
      {
        session_id: sessionId,
        enrollment_id: enrollmentId,
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

export const ParticipantService = {
  getOrCreateNewParticipant,
  createParticipant,
}
