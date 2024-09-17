import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// eslint-disable-next-line import/no-cycle

import { setMessagesAction } from '../../ai/ai.slice'

import { getRealtimeChannelsForEvent } from '@/services/realtime/supabase-realtime.service'
import {
  attachThunkToBuilder,
  buildThunkState,
  renameSliceActions,
  ThunkState,
} from '@/stores/helpers'
import { attachStoreListener } from '@/stores/listener'
import { getEventThunk } from '@/stores/thunks/event.thunks'
import { getMeetingThunk } from '@/stores/thunks/meeting.thunks'
import { EventModel, FrameModel, SectionModel } from '@/types/models'

type EventState = {
  eventId: EventModel['id'] | null
  event: ThunkState<EventModel>
  isOverviewOpen: boolean
  isCurrentUserOwnerOfEvent: boolean | null
  isPreviewOpen: boolean
  currentFrameId: FrameModel['id'] | null
  currentSectionId: SectionModel['id'] | null
}

const initialState: EventState = {
  eventId: null,
  event: buildThunkState<EventModel>(),
  isOverviewOpen: true,
  isCurrentUserOwnerOfEvent: null,
  isPreviewOpen: false,
  currentFrameId: null,
  currentSectionId: null,
}

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setCurrentEventId: (
      state,
      action: PayloadAction<EventState['eventId']>
    ) => {
      state.eventId = action.payload
    },
    setIsCurrentUserOwnerOfEvent: (state, action: PayloadAction<boolean>) => {
      state.isCurrentUserOwnerOfEvent = action.payload
    },
    setIsOverviewOpen: (state, action: PayloadAction<boolean>) => {
      state.isOverviewOpen = action.payload
    },
    setCurrentFrameId: (
      state,
      action: PayloadAction<FrameModel['id'] | null>
    ) => {
      state.currentFrameId = action.payload
    },
    setIsPreviewOpen: (state, action: PayloadAction<boolean>) => {
      state.isPreviewOpen = action.payload
    },
    setCurrentSectionId: (
      state,
      action: PayloadAction<EventState['currentSectionId']>
    ) => {
      state.currentSectionId = action.payload
    },
    resetEvent: () => initialState,
  },
  extraReducers: (builder) => {
    attachThunkToBuilder({
      builder,
      thunk: getEventThunk,
      getThunkState: (state) => state.event,
    })
  },
})

attachStoreListener({
  actionCreator: getEventThunk.fulfilled,
  effect: (action, { dispatch, getState }) => {
    const state = getState()
    const event = action.payload
    dispatch(
      setIsCurrentUserOwnerOfEventAction(
        event?.owner_id === state.user.currentUser.user?.id
      )
    )
    if (state.event.currentEvent.liveSessionState.dyte.currentDyteMeetingId) {
      return
    }
    dispatch(setCurrentFrameIdAction(null))
    dispatch(setCurrentSectionIdAction(null))
    dispatch(setIsOverviewOpenAction(true))
    dispatch(setMessagesAction([]))
  },
})

attachStoreListener({
  actionCreator: eventSlice.actions.setCurrentEventId,
  effect: (_, { dispatch, getState }) => {
    const state = getState()
    dispatch(
      getMeetingThunk(state.event.currentEvent.eventState.eventId as string)
    )
    dispatch(
      getEventThunk(state.event.currentEvent.eventState.eventId as string)
    )
  },
})

attachStoreListener({
  actionCreator: eventSlice.actions.setCurrentEventId,
  effect: (action, { getOriginalState }) => {
    if (action.payload) return
    const { eventId } = getOriginalState().event.currentEvent.eventState

    getRealtimeChannelsForEvent(eventId as string).forEach((channels) =>
      channels.unsubscribe()
    )
  },
})

export const {
  setCurrentEventIdAction,
  setIsOverviewOpenAction,
  setCurrentSectionIdAction,
  setIsPreviewOpenAction,
  setIsCurrentUserOwnerOfEventAction,
  setCurrentFrameIdAction,
  resetEventAction,
} = renameSliceActions(eventSlice.actions)
