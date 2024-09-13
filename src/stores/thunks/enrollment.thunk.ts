import { createAsyncThunk } from '@reduxjs/toolkit'

import { RootState } from '../store'

import { EnrollmentService } from '@/services/enrollment.service'
import { EnrollmentModel } from '@/types/models'

export const getEnrollmentThunk = createAsyncThunk<
  EnrollmentModel,
  {
    eventId: string
  },
  {
    state: RootState
  }
>('liveSession/getEnrollmentThunk', async ({ eventId }, { getState }) => {
  const userId = getState().user.currentUser?.user?.id || ''

  const enrollment = await EnrollmentService.getEnrollment({
    eventId,
    userId,
  })

  return enrollment.data || null
})
