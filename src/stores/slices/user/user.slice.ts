import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@supabase/supabase-js'

import { attachOnStoreInitListener, renameSliceActions } from '@/stores/helpers'
import { attachStoreListener } from '@/stores/listener'
import { getProfileThunk } from '@/stores/thunks/profile.thunk'
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

attachStoreListener({
  actionCreator: getUserThunk.fulfilled,
  effect: (_, { dispatch, getState }) => {
    const userId = getState().user.currentUser.user?.id
    dispatch(getProfileThunk(userId as string))
  },
})

attachOnStoreInitListener(async (_, { dispatch }) => {
  dispatch(getUserThunk())

  supabaseClient.auth.onAuthStateChange(async () => {
    dispatch(getUserThunk())
  })
})

export const { setUserAction } = renameSliceActions(userSlice.actions)
