/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/utils/supabase/client'

const getEnrollment = async ({
  eventId,
  userId,
}: {
  eventId: string
  userId: string
}) => {
  const query = supabaseClient
    .from('enrollment')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

export const EnrollmentService = {
  getEnrollment,
}
