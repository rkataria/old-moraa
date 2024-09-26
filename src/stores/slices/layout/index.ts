import { combineReducers } from 'redux'

import { layoutLiveSlice } from './live.slice'

export const combinedLayoutReducer = combineReducers({
  live: layoutLiveSlice.reducer,
})
