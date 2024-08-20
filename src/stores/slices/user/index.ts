import { combineReducers } from 'redux'

import { userSlice } from './user.slice'

export const combinedUserReducer = combineReducers({
  [userSlice.reducerPath]: userSlice.reducer,
})
