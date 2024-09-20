import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { setCurrentSectionIdAction } from './event.slice'

import {
  attachThunkToBuilder,
  buildThunkState,
  renameSliceActions,
  ThunkState,
} from '@/stores/helpers'
import { attachStoreListener } from '@/stores/listener'
import { getFramesThunk } from '@/stores/thunks/frame.thunks'
import {
  getMeetingThunk,
  updateMeetingThunk,
} from '@/stores/thunks/meeting.thunks'
import {
  deleteSectionThunk,
  getSectionsThunk,
} from '@/stores/thunks/section.thunks'
import { MeetingModel } from '@/types/models'
import { supabaseClient } from '@/utils/supabase/client'

type MeetingState = {
  meeting: ThunkState<MeetingModel>
}

const initialState: MeetingState = {
  meeting: buildThunkState<MeetingModel>(),
}

export const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setCurrentMeeting: (state, action: PayloadAction<MeetingModel>) => {
      state.meeting.data = action.payload
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reorderSections: (
      state,
      action: PayloadAction<{ destinationIndex: number; sourceIndex: number }>
    ) => {
      if (!state.meeting.data?.sections) return
      if (action.payload.sourceIndex === action.payload.destinationIndex) return

      const sourceSectionId =
        state.meeting.data.sections[action.payload.sourceIndex]
      const newSections = [...state.meeting.data.sections].filter(
        (section) => section !== sourceSectionId
      )
      newSections.splice(action.payload.destinationIndex, 0, sourceSectionId)
      state.meeting.data.sections = newSections
    },
  },
  extraReducers: (builder) => {
    attachThunkToBuilder({
      builder,
      thunk: getMeetingThunk,
      getThunkState: (state) => state.meeting,
    })
  },
})

attachStoreListener({
  actionCreator: getMeetingThunk.fulfilled,
  effect: (action, { dispatch }) => {
    dispatch(getFramesThunk(action.payload.id))
  },
})

attachStoreListener({
  actionCreator: getMeetingThunk.fulfilled,
  effect: (action, { dispatch }) => {
    dispatch(
      getSectionsThunk({
        sectionIds: action.payload.sections || [],
      })
    )
  },
})

attachStoreListener({
  actionCreator: meetingSlice.actions.reorderSections,
  effect: (_, { dispatch, getState }) => {
    const state = getState()
    if (!state.event.currentEvent.meetingState.meeting.data) return

    dispatch(
      updateMeetingThunk({
        meetingId: state.event.currentEvent.meetingState.meeting.data?.id,
        data: {
          sections: state.event.currentEvent.meetingState.meeting.data
            .sections as string[],
        },
      })
    )
  },
})

attachStoreListener({
  actionCreator: deleteSectionThunk.fulfilled,
  effect: async (action, { dispatch, getState }) => {
    const state = getState()

    if (!state.event.currentEvent.meetingState.meeting.data) return

    const { sections } = state.event.currentEvent.meetingState.meeting.data

    if (!sections) return

    const deletedSectionIndex = sections.indexOf(action.payload.sectionId)

    const response = await dispatch(
      updateMeetingThunk({
        meetingId: state.event.currentEvent.meetingState.meeting.data?.id,
        data: {
          sections: sections.filter(
            (section) => section !== action.payload.sectionId
          ),
        },
      })
    )

    if (response.type === 'event/updateMeeting/fulfilled') {
      if (deletedSectionIndex < 0) return

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const nextSectionId = response.payload.sections[deletedSectionIndex]

      dispatch(setCurrentSectionIdAction(nextSectionId))
    }
  },
})

attachStoreListener({
  actionCreator: getMeetingThunk.fulfilled,
  effect: (_, { dispatch, getState }) => {
    const { eventId } = getState().event.currentEvent.eventState
    const meetingId =
      getState().event.currentEvent.meetingState.meeting.data?.id

    supabaseClient
      .channel(`event:${eventId}-0`)
      ?.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'meeting',
          filter: `id=eq.${meetingId}`,
        },
        (payload) => {
          if (payload?.new) {
            dispatch(
              meetingSlice.actions.setCurrentMeeting(
                payload.new as MeetingModel
              )
            )
          }
        }
      )
      .subscribe()
  },
})

export const { setCurrentMeetingAction, reorderSectionsAction } =
  renameSliceActions(meetingSlice.actions)
