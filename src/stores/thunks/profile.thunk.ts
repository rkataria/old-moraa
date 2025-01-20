import { createAsyncThunk } from '@reduxjs/toolkit'

import { ProfileService } from '@/services/profile.service'
import { ProfileModel } from '@/types/models'

export const getProfileThunk = createAsyncThunk<ProfileModel, string>(
  'profile/getProfile',
  async (userId: string) => {
    const response = await ProfileService.getProfile(userId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data as any
  }
)
