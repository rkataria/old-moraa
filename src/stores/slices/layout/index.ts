import { combineReducers } from 'redux'

import { layoutLiveSlice } from './live.slice'
import { layoutStudioSlice } from './studio.slice'

export const combinedLayoutReducer = combineReducers({
  live: layoutLiveSlice.reducer,
  studio: layoutStudioSlice.reducer,
})
