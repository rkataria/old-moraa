import { createAsyncThunk } from '@reduxjs/toolkit'

import { ParticipantService } from '@/services/participant.service'
import { ParticipantModel } from '@/types/models'

export const getExistingOrCreateNewParticipantThunk = createAsyncThunk<
  ParticipantModel,
  {
    sessionId: string
    enrollmentId: string
  }
>(
  'liveSession/getExistingOrCreateNewParticipantThunk',
  async ({ enrollmentId, sessionId }) => {
    const session = await ParticipantService.getOrCreateNewParticipant({
      enrollmentId,
      sessionId,
    })

    return session.data || null
  }
)
