import DyteClient, { DyteParticipants } from '@dytesdk/web-core'
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit'
import { RealtimePostgresChangesPayload } from '@supabase/realtime-js'

import { setCurrentFrameIdAction } from './event.slice'

import { getRealtimeChannelsForEvent } from '@/services/realtime/supabase-realtime.service'
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

/**
 * This session state is only to maintain data in DB and any changes made to the data in DB should be copied over to the appropriate state in redux.
 * As an example we have currentFrameId in this state, but it is not supposed to be read from anywhere in the code.
 * There is a on change listener for this value below, so when the value is updated in DB the local copy of this is also being updated.
 * On the other way around when the local value is needs to be updated we just update it in the DB and locally both.
 */
export type SessionState = {
  currentFrameId?: string | null
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
  isMeetingJoined: boolean
  currentDyteMeetingId: string | null
  isInBreakoutMeeting: boolean
  isDyteMeetingLoading: boolean
  dyteClient?: DyteClient | null
}

const initialState: LiveSessionState = {
  eventSessionMode: EventSessionMode.LOBBY,
  participants: buildThunkState([]),
  activeSession: buildThunkState<SessionModelWithData>(),
  isMeetingJoined: false,
  isDyteMeetingLoading: false,
  currentDyteMeetingId: null,
  isInBreakoutMeeting: false,
  dyteClient: null,
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
    setIsMeetingJoined: (state, action: PayloadAction<boolean>) => {
      state.isMeetingJoined = action.payload
    },
    setCurrentDyteMeetingId: (state, action: PayloadAction<string>) => {
      state.currentDyteMeetingId = action.payload
    },
    setIsInBreakout: (state, action: PayloadAction<boolean>) => {
      state.isInBreakoutMeeting = action.payload
    },
    setIsDyteMeetingLoading: (state, action: PayloadAction<boolean>) => {
      state.isDyteMeetingLoading = action.payload
    },
    setDyteClient: (state, action: PayloadAction<DyteClient>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.dyteClient = action.payload
    },
    removeDyteClient: (state) => {
      state.dyteClient = null
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
    const sessionId =
      getState().event.currentEvent.liveSessionState.activeSession.data!.id
    const newSessionData =
      getState().event.currentEvent.liveSessionState.activeSession.data?.data

    SessionService.updateSession({
      sessionPayload: { data: newSessionData },
      sessionId,
    })
  },
})

attachStoreListener({
  matcher: isAnyOf(
    liveSessionSlice.actions.updateMeetingSessionData,
    liveSessionSlice.actions.silentUpdateMeetingSessionData
  ),
  effect: (_, { getState, getOriginalState, dispatch }) => {
    const { isCurrentUserOwnerOfEvent, currentFrameId } =
      getState().event.currentEvent.eventState
    const newSessionData =
      getState().event.currentEvent.liveSessionState.activeSession.data?.data
    const oldEventSessionMode =
      getOriginalState().event.currentEvent.liveSessionState.eventSessionMode

    const newFrameIdToUpdate = newSessionData?.currentFrameId
    let newEventSessionModeToUpdate = null

    if (
      newSessionData?.presentationStatus === PresentationStatuses.STOPPED &&
      newFrameIdToUpdate
    ) {
      newEventSessionModeToUpdate = isCurrentUserOwnerOfEvent
        ? EventSessionMode.PREVIEW
        : EventSessionMode.LOBBY
    } else if (
      newSessionData?.presentationStatus === PresentationStatuses.STARTED
    ) {
      newEventSessionModeToUpdate = EventSessionMode.PRESENTATION
    } else {
      newEventSessionModeToUpdate = EventSessionMode.LOBBY
    }

    if (newFrameIdToUpdate !== currentFrameId) {
      dispatch(setCurrentFrameIdAction(newFrameIdToUpdate || null))
    }
    if (oldEventSessionMode !== newEventSessionModeToUpdate) {
      dispatch(updateEventSessionModeAction(newEventSessionModeToUpdate))
    }
  },
})

attachStoreListener({
  actionCreator: liveSessionSlice.actions.setIsInBreakout,
  effect: async (action, { dispatch, getState }) => {
    const meetingId =
      getState().event.currentEvent.meetingState.meeting.data?.id
    const { dyteClient } = getState().event.currentEvent.liveSessionState

    const dyteConnectedMeetingId = dyteClient?.meta.meetingId

    if (!dyteClient || !dyteConnectedMeetingId || !meetingId) return
    if (action.payload) {
      dispatch(
        getMeetingSessionThunk({
          meetingId,
          connectedDyteMeetingId: dyteConnectedMeetingId,
        })
      )
    } else {
      dispatch(
        getMeetingSessionThunk({
          meetingId,
        })
      )
    }
  },
})

attachStoreListener({
  actionCreator: liveSessionSlice.actions.setDyteClient,
  effect: (action, { dispatch, getState }) => {
    const dyteClient = action.payload
    if (!dyteClient) return
    const state = getState()
    dispatch(setCurrentDyteMeetingIdAction(dyteClient.meta.meetingId))
    if (
      dyteClient.connectedMeetings?.parentMeeting &&
      dyteClient.meta.meetingId !==
        dyteClient.connectedMeetings?.parentMeeting?.id &&
      !state.event.currentEvent.liveSessionState.isInBreakoutMeeting
    ) {
      dispatch(setIsInBreakoutAction(true))
    } else if (state.event.currentEvent.liveSessionState.isInBreakoutMeeting) {
      dispatch(setIsInBreakoutAction(false))
    }
    const roomJoinedListener = () => {
      dispatch(setIsMeetingJoinedAction(true))
    }
    const roomLeftListener = () => {
      if (dyteClient.connectedMeetings.isActive) {
        dispatch(setIsDyteMeetingLoadingAction(true))

        return
      }
      dispatch(setIsMeetingJoinedAction(false))
    }
    const changingMeetingListener = () => {
      dispatch(setIsDyteMeetingLoadingAction(true))
    }
    const meetingChangedListener = () => {
      dispatch(setIsDyteMeetingLoadingAction(false))
    }
    dyteClient.self.addListener('roomJoined', roomJoinedListener)
    dyteClient.self.addListener('roomLeft', roomLeftListener)
    dyteClient.connectedMeetings.on('changingMeeting', changingMeetingListener)
    dyteClient.connectedMeetings.on('meetingChanged', meetingChangedListener)
  },
})

attachStoreListener({
  predicate: isAnyOf(
    getExistingOrCreateNewActiveSessionThunk.fulfilled,
    getMeetingSessionThunk.fulfilled
  ),
  effect: (action, { dispatch, getState }) => {
    const meetingId =
      action.type === getMeetingSessionThunk.fulfilled.type
        ? getState().event.currentEvent.meetingState.meeting!.data!.id
        : getState().event.currentEvent.liveSessionState.activeSession.data
            ?.meeting_id
    const { eventId } = getState().event.currentEvent.eventState

    dispatch(
      liveSessionSlice.actions.silentUpdateMeetingSessionData(
        (action.payload as SessionModel)?.data as SessionState
      )
    )

    if (getState().event.currentEvent.liveSessionState.isInBreakoutMeeting) {
      getRealtimeChannelsForEvent(`${eventId}-3`).find((channel) =>
        channel.unsubscribe()
      )

      return
    }

    supabaseClient
      .channel(`event:${eventId}-3`, { config: { broadcast: { self: false } } })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session',
          filter: `meeting_id=eq.${meetingId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: RealtimePostgresChangesPayload<{ data?: SessionState }>) => {
          if (
            payload.eventType === 'INSERT' &&
            meetingId &&
            !getState().event.currentEvent.liveSessionState.isInBreakoutMeeting
          ) {
            dispatch(getMeetingSessionThunk({ meetingId }))

            return
          }
          if (payload.eventType !== 'UPDATE') {
            return
          }
          if (!payload.new.data) return

          const newSessionData = payload.new.data

          dispatch(
            liveSessionSlice.actions.silentUpdateMeetingSessionData(
              newSessionData
            )
          )
        }
      )
      .subscribe()
  },
})

export const {
  updateEventSessionModeAction,
  updateMeetingSessionDataAction,
  setIsMeetingJoinedAction,
  setCurrentDyteMeetingIdAction,
  setIsDyteMeetingLoadingAction,
  setIsInBreakoutAction,
  setDyteClientAction,
  removeDyteClientAction,
} = renameSliceActions(liveSessionSlice.actions)
