import { supabaseClient } from '@/utils/supabase/client'

const getEnrollment = async ({
  eventId,
  userId,
}: {
  eventId: string
  userId: string
}) => {
  const { data } = await supabaseClient
    .from('enrollment')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)

  return data?.[0]
}

export const EnrollmentService = {
  getEnrollment,
}
