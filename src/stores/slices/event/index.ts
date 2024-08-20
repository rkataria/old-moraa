import { combineReducers } from 'redux'

import { currentEventReducer } from './current-event'

export const combinedEventReducer = combineReducers({
  currentEvent: currentEventReducer,
})
