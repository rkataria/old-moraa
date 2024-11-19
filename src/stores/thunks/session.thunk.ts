import { createAsyncThunk } from '@reduxjs/toolkit'

import { SessionState } from '../slices/event/current-event/live-session.slice'

import { SessionService } from '@/services/session.service'
import { PresentationStatuses } from '@/types/event-session.type'
import { SessionModel } from '@/types/models'

export const getExistingOrCreateNewActiveSessionThunk = createAsyncThunk<
  SessionModel,
  string
>(
  'liveSession/getExistingOrCreateNewActiveSession',
  async (meetingId: string) => {
    const defaultSessionData: SessionState = {
      presentationStatus: PresentationStatuses.STOPPED,
    }
    const session = await SessionService.getExistingOrCreateNewActiveSession({
      meetingId,
      defaultData: defaultSessionData,
    })

    return session.data || null
  }
)

export const getMeetingSessionThunk = createAsyncThunk<
  SessionModel,
  {
    meetingId: string
    connectedDyteMeetingId?: string
  }
>(
  'liveSession/getMeetingSession',
  async ({ meetingId, connectedDyteMeetingId }) => {
    const session = await SessionService.getActiveSession({
      meetingId,
      connectedDyteMeetingId,
      status: 'LIVE',
    })

    return session.data || null
  }
)
