import { combineReducers } from '@reduxjs/toolkit'

import { eventSlice } from './event.slice'
import { frameSlice } from './frame.slice'
import { liveSessionSlice } from './live-session.slice'
import { meetingSlice } from './meeting.slice'
import { sectionSlice } from './section.slice'

export const currentEventReducer = combineReducers({
  eventState: eventSlice.reducer,
  meetingState: meetingSlice.reducer,
  frameState: frameSlice.reducer,
  sectionState: sectionSlice.reducer,
  liveSessionState: liveSessionSlice.reducer,
})
