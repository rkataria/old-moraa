import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@supabase/supabase-js'
import userflow from 'userflow.js'

import { attachOnStoreInitListener, renameSliceActions } from '@/stores/helpers'
import { getUserThunk } from '@/stores/thunks/user.thunks'
import { supabaseClient } from '@/utils/supabase/client'

const initialState: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: User | null
  isLoading: boolean
  isError: boolean
} = {
  user: null,
  isError: false,
  isLoading: true,
}

export const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      userflow.identify(state.user.id)
      userflow.init(`${import.meta.env.VITE_USERFLOW_ID}`)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true
      state.isError = false
    })
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.user = action.payload
      state.isLoading = false
      state.isError = false
    })
    builder.addCase(getUserThunk.rejected, (state) => {
      state.user = null
      state.isLoading = false
      state.isError = true
    })
  },
})

attachOnStoreInitListener(async (_, { dispatch }) => {
  dispatch(getUserThunk())

  supabaseClient.auth.onAuthStateChange(async () => {
    dispatch(getUserThunk())
  })
})

export const { setUserAction } = renameSliceActions(userSlice.actions)
