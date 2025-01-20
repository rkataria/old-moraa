import { combineReducers } from 'redux'

import { profileSlice } from './profile.slice'
import { userSlice } from './user.slice'

export const combinedUserReducer = combineReducers({
  [userSlice.reducerPath]: userSlice.reducer,
  [profileSlice.reducerPath]: profileSlice.reducer,
})
