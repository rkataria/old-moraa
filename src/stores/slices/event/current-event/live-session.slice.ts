import { DyteParticipants } from '@dytesdk/web-core'
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit'
import { RealtimePostgresChangesPayload } from '@supabase/realtime-js'

import { SessionService } from '@/services/session.service'
import {
  attachThunkToBuilder,
  buildThunkState,
  renameSliceActions,
  ThunkState,
} from '@/stores/helpers'
import { attachStoreListener } from '@/stores/listener'
import {
  getExistingOrCreateNewActiveSessionThunk,
  getMeetingSessionThunk,
} from '@/stores/thunks/session.thunk'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'
import { SessionModel } from '@/types/models'
import { supabaseClient } from '@/utils/supabase/client'

export type SessionState = {
  currentFrameId?: string
  presentationStatus?: PresentationStatuses
  slideAssignedToRooms?: {
    [x: string]: string
  }
  handsRaised?: string[]
  typingUsers?: Array<{ participantId: string; participantName?: string }>
}

type SessionModelWithData = Omit<SessionModel, 'data'> & { data?: SessionState }

type LiveSessionState = {
  participants: ThunkState<DyteParticipants[]>
  eventSessionMode: EventSessionMode
  activeSession: ThunkState<SessionModelWithData>
}

const initialState: LiveSessionState = {
  eventSessionMode: EventSessionMode.LOBBY,
  participants: buildThunkState([]),
  activeSession: buildThunkState<SessionModelWithData>(),
}

export const liveSessionSlice = createSlice({
  name: 'liveSession',
  initialState,
  reducers: {
    updateMeetingSessionData: (state, action: PayloadAction<SessionState>) => {
      if (state.activeSession.isSuccess !== true) {
        console.error('Session must be fetched before updating it.')

        return
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.activeSession.data.data = {
        ...state.activeSession.data?.data,
        ...action.payload,
      }
    },
    silentUpdateMeetingSessionData: (
      state,
      action: PayloadAction<SessionState>
    ) => {
      if (state.activeSession.isSuccess !== true) {
        console.error('Session must be fetched before updating it.')

        return
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.activeSession.data.data = {
        ...state.activeSession.data?.data,
        ...action.payload,
      }
    },
    updateEventSessionMode: (
      state,
      action: PayloadAction<EventSessionMode>
    ) => {
      state.eventSessionMode = action.payload
    },
  },
  extraReducers: (builder) => {
    attachThunkToBuilder({
      builder,
      thunk: getExistingOrCreateNewActiveSessionThunk,
      getThunkState: (state) => state.activeSession,
    })
    attachThunkToBuilder({
      builder,
      thunk: getMeetingSessionThunk,
      getThunkState: (state) => state.activeSession,
    })
  },
})

attachStoreListener({
  actionCreator: liveSessionSlice.actions.updateMeetingSessionData,
  effect: (_, { getState }) => {
    const meetingId =
      getState().event.currentEvent.meetingState.meeting.data!.id
    const newSessionData =
      getState().event.currentEvent.liveSessionState.activeSession.data?.data

    SessionService.updateSession({
      sessionPayload: { data: newSessionData },
      sessionId: meetingId,
    })
  },
})

attachStoreListener({
  predicate: isAnyOf(
    getExistingOrCreateNewActiveSessionThunk.fulfilled,
    getMeetingSessionThunk.fulfilled
  ),
  effect: (_, { dispatch, getState }) => {
    const meetingId =
      getState().event.currentEvent.liveSessionState.activeSession.data
        ?.meeting_id
    const { eventId, isCurrentUserOwnerOfEvent } =
      getState().event.currentEvent.eventState

    supabaseClient
      .channel(`event:${eventId}-3`, { config: { broadcast: { self: false } } })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session',
          filter: `id=eq.${meetingId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: RealtimePostgresChangesPayload<{ data?: SessionState }>) => {
          if (
            payload.eventType !== 'INSERT' &&
            payload.eventType !== 'UPDATE'
          ) {
            return
          }
          if (!payload.new.data) return

          const newSessionData = payload.new.data

          dispatch(
            liveSessionSlice.actions.silentUpdateMeetingSessionData(
              newSessionData
            )
          )

          if (
            newSessionData.presentationStatus ===
              PresentationStatuses.STOPPED &&
            newSessionData.currentFrameId
          ) {
            dispatch(
              updateEventSessionModeAction(
                isCurrentUserOwnerOfEvent
                  ? EventSessionMode.PREVIEW
                  : EventSessionMode.LOBBY
              )
            )
          } else {
            dispatch(
              updateEventSessionModeAction(EventSessionMode.PRESENTATION)
            )
          }
        }
      )
      .subscribe()
  },
})

export const { updateEventSessionModeAction, updateMeetingSessionDataAction } =
  renameSliceActions(liveSessionSlice.actions)
