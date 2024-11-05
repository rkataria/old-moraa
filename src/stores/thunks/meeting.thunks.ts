import { createAsyncThunk } from '@reduxjs/toolkit'

import { EventService } from '@/services/event.service'
import { MeetingService } from '@/services/meeting.service'
import { MeetingModel } from '@/types/models'

export const getMeetingThunk = createAsyncThunk<MeetingModel, string>(
  'event/getMeeting',
  async (eventId: string) => {
    const response = await EventService.getEvent({ eventId })

    return response.meeting as MeetingModel
  }
)

type UpdateMeetingThunkParams = {
  meetingId: string
  data: {
    sections: string[]
  }
}
export const updateMeetingThunk = createAsyncThunk<
  MeetingModel,
  UpdateMeetingThunkParams
>(
  'event/updateMeeting',
  async ({ meetingId, data }: UpdateMeetingThunkParams) => {
    const response = await MeetingService.updateMeeting({
      meetingId,
      meetingPayload: data,
    })

    return response.data
  }
)
