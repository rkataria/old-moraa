import { createAsyncThunk } from '@reduxjs/toolkit'

import { SessionState } from '../slices/event/current-event/live-session.slice'

import { SessionService } from '@/services/session.service'
import { PresentationStatuses } from '@/types/event-session.type'
import { SessionModel } from '@/types/models'

export const getExistingOrCreateNewActiveSessionThunk = createAsyncThunk<
  SessionModel,
  { dyteMeetingId?: string; meetingId?: string }
>(
  'liveSession/getExistingOrCreateNewActiveSession',
  async ({ meetingId, dyteMeetingId }) => {
    const defaultSessionData: SessionState = {
      presentationStatus: PresentationStatuses.STOPPED,
    }
    const session = await SessionService.getExistingOrCreateNewActiveSession({
      dyteMeetingId,
      meetingId,
      defaultData: defaultSessionData,
    })

    return session.data || null
  }
)

export const getMeetingSessionThunk = createAsyncThunk<
  SessionModel,
  {
    meetingId?: string
    dyteMeetingId?: string
  }
>('liveSession/getMeetingSession', async ({ meetingId, dyteMeetingId }) => {
  const session = await SessionService.getActiveSession({
    meetingId,
    connectedDyteMeetingId: dyteMeetingId,
    status: 'ACTIVE',
  })

  return (session.data as SessionModel) || null
})
