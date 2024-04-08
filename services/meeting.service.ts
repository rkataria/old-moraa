import { APIService } from './api-service'

const updateMeeting = async ({
  meetingPayload,
  meetingId,
}: {
  meetingPayload: {
    sections: string[]
  }
  meetingId: string
}) => {
  const query = APIService.supabaseClient
    .from('meeting')
    .update({ sections: meetingPayload.sections })
    .eq('id', meetingId)
    .select('*')
    .single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

export const MeetingService = {
  updateMeeting,
}
