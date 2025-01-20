import { createSlice } from '@reduxjs/toolkit'

import { getProfileThunk } from '@/stores/thunks/profile.thunk'
import { ProfileModel } from '@/types/models'

const initialState: {
  profile: ProfileModel | null
  isLoading: boolean
  isError: boolean
} = {
  profile: null,
  isError: false,
  isLoading: false,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfileThunk.pending, (state) => {
      state.isLoading = true
      state.isError = false
    })
    builder.addCase(getProfileThunk.fulfilled, (state, action) => {
      state.profile = action.payload
      state.isLoading = false
      state.isError = false
    })
    builder.addCase(getProfileThunk.rejected, (state) => {
      state.profile = null
      state.isLoading = false
      state.isError = true
    })
  },
})
