import { combineReducers } from 'redux'

import { aiChatSlice } from './ai.slice'

export const combinedAiReducer = combineReducers({
  chat: aiChatSlice.reducer,
})
