import { combineReducers } from 'redux'

import { aichatSlice } from './ai.slice'

export const combinedAiReducer = combineReducers({
  chat: aichatSlice.reducer,
})
