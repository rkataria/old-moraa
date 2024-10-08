import { createSlice } from '@reduxjs/toolkit'

import { renameSliceActions } from '@/stores/helpers'

export interface TimerState {
  duration: { total: number; remaining: number }
  updateTimerOnParticipantJoin: boolean
  timerState: 'running' | 'paused' | 'stopped'
}

const initialState: TimerState = {
  updateTimerOnParticipantJoin: false,
  timerState: 'stopped',
  duration: {
    total: 30,
    remaining: 30,
  },
}

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setDuration(state, action) {
      state.duration = action.payload
    },

    setUpdateTimerOnParticipantJoin(state, action) {
      state.updateTimerOnParticipantJoin = action.payload
    },

    setTimerState(state, action) {
      state.timerState = action.payload
    },
  },
})

export const {
  setDurationAction,
  setUpdateTimerOnParticipantJoinAction,
  setTimerStateAction,
} = renameSliceActions(timerSlice.actions)
