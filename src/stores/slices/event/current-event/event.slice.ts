import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
    clearCurrentEventId: (state) => {
      state.eventId = null
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
  effect: (_, { dispatch, getState }) => {
    const state = getState()
    dispatch(
      setIsCurrentUserOwnerOfEventAction(
        state.event.currentEvent.eventState.event.data!.owner_id ===
          state.user.currentUser.user!.id
      )
    )
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
  actionCreator: eventSlice.actions.clearCurrentEventId,
  effect: (_, { getOriginalState }) => {
    const { eventId } = getOriginalState().event.currentEvent.eventState

    getRealtimeChannelsForEvent(eventId as string).forEach((channels) =>
      channels.unsubscribe()
    )
  },
})

export const {
  setCurrentEventIdAction,
  setIsOverviewOpenAction,
  clearCurrentEventIdAction,
  setCurrentSectionIdAction,
  setIsPreviewOpenAction,
  setIsCurrentUserOwnerOfEventAction,
  setCurrentFrameIdAction,
} = renameSliceActions(eventSlice.actions)
