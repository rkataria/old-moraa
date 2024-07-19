/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/utils/supabase/client'

const updateMeeting = async ({
  meetingPayload,
  meetingId,
}: {
  meetingPayload: {
    sections: string[]
  }
  meetingId: string
}) => {
  const query = supabaseClient
    .from('meeting')
    .update({ sections: meetingPayload.sections })
    .eq('id', meetingId)
    .select('*')
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

export const MeetingService = {
  updateMeeting,
}
