import { createAsyncThunk } from '@reduxjs/toolkit'

import { SessionService } from '@/services/session.service'
import { SessionModel } from '@/types/models'

export const getExistingOrCreateNewActiveSessionThunk = createAsyncThunk<
  SessionModel,
  string
>(
  'liveSession/getExistingOrCreateNewActiveSession',
  async (meetingId: string) => {
    const session = await SessionService.getExistingOrCreateNewActiveSession({
      meetingId,
    })

    return session.data || null
  }
)

export const getMeetingSessionThunk = createAsyncThunk<SessionModel, string>(
  'liveSession/getMeetingSession',
  async (meetingId: string) => {
    const session = await SessionService.getActiveSession({
      meetingId,
      status: 'LIVE',
    })

    return session.data || null
  }
)
