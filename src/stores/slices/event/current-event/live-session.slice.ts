import DyteClient from '@dytesdk/web-core'
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

import {
  setCurrentFrameIdAction,
  setCurrentSectionIdAction,
} from './event.slice'
import { collapseLeftSidebarAction } from '../../layout/live.slice'

import { USER_PREFERENCES_LOCAL_STORAGE_KEY } from '@/constants/common'
import { getRealtimeChannelForEvent } from '@/services/realtime/supabase-realtime.service'
import { SessionService } from '@/services/session.service'
import {
  attachThunkToBuilder,
  buildThunkState,
  renameSliceActions,
  ThunkState,
} from '@/stores/helpers'
import { attachStoreListener } from '@/stores/listener'
import { getEnrollmentThunk } from '@/stores/thunks/enrollment.thunk'
import { getExistingOrCreateNewParticipantThunk } from '@/stores/thunks/participant.thunk'
import {
  getExistingOrCreateNewActiveSessionThunk,
  getMeetingSessionThunk,
} from '@/stores/thunks/session.thunk'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'
import { EnrollmentModel, ParticipantModel, SessionModel } from '@/types/models'
import { supabaseClient } from '@/utils/supabase/client'

/**
 * This session state is only to maintain data in DB and any changes made to the data in DB should be copied over to the appropriate state in redux.
 * As an example we have currentFrameId in this state, but it is not supposed to be read from anywhere in the code.
 * There is a on change listener for this value below, so when the value is updated in DB the local copy of this is also being updated.
 * On the other way around when the local value is needs to be updated we just update it in the DB and locally both.
 */
export type SessionState = {
  currentFrameId?: string | null
  breakoutFrameId?: string | null
  presentationStatus?: PresentationStatuses
  handsRaised?: string[]
  currentSectionId?: string | null
  GSlideLastPosition?: number | null
  connectedMeetingsToActivitiesMap?: {
    [x: string]: string
  } | null
  meetingTitles?: { title: string; id: string }[] | null
  breakoutType?: 'planned' | 'unplanned' | null
  timerStartedStamp?: number | null
  timerDuration?: number | null
  music?: {
    track?: string
    play?: boolean
    volume?: number
    mute?: boolean
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  framesConfig?: any
}

type SessionModelWithData = Omit<SessionModel, 'data'> & { data?: SessionState }

type LiveSessionState = {
  eventSessionMode: EventSessionMode
  activeSession: ThunkState<SessionModelWithData>
  participant: ThunkState<ParticipantModel>
  enrollment: ThunkState<EnrollmentModel>

  dyte: {
    isMeetingJoined: boolean
    currentDyteMeetingId: string | null
    isDyteMeetingLoading: boolean
    dyteClient?: DyteClient | null
  }

  breakout: {
    isBreakoutActive: boolean
    isInBreakoutMeeting: boolean
    isBreakoutOverviewOpen: boolean
    breakoutNotify: boolean
  }

  recording: {
    notify: boolean
  }
}

const initialState: LiveSessionState = {
  eventSessionMode: EventSessionMode.LOBBY,
  activeSession: buildThunkState<SessionModelWithData>(),
  participant: buildThunkState<ParticipantModel>(),
  enrollment: buildThunkState<EnrollmentModel>(),

  dyte: {
    isMeetingJoined: false,
    isDyteMeetingLoading: false,
    currentDyteMeetingId: null,
    dyteClient: null,
  },
  breakout: {
    isBreakoutActive: false,
    isInBreakoutMeeting: false,
    isBreakoutOverviewOpen: false,
    breakoutNotify: false,
  },
  recording: {
    notify: false,
  },
}

export const liveSessionSlice = createSlice({
  name: 'liveSession',
  initialState,
  reducers: {
    /**
     * Meeting session reducers
     */
    updateMeetingSessionData: (state, action: PayloadAction<SessionState>) => {
      if (!state.activeSession.data || state.activeSession.isSuccess !== true) {
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
      if (!state.activeSession.data || state.activeSession.isSuccess !== true) {
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

    /**
     * Breakout reducers
     */
    setIsBreakoutOverviewOpen: (state, action: PayloadAction<boolean>) => {
      state.breakout.isBreakoutOverviewOpen = action.payload
    },
    setIsBreakoutActive: (state, action: PayloadAction<boolean>) => {
      state.breakout.isBreakoutActive = action.payload
    },
    setIsInBreakout: (state, action: PayloadAction<boolean>) => {
      state.breakout.isInBreakoutMeeting = action.payload
    },

    /**
     * Dyte reducers
     */
    setDyteClient: (
      state,
      action: PayloadAction<LiveSessionState['dyte']['dyteClient']>
    ) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.dyte.dyteClient = action.payload
    },
    setIsMeetingJoined: (state, action: PayloadAction<boolean>) => {
      state.dyte.isMeetingJoined = action.payload
    },
    setCurrentDyteMeetingId: (state, action: PayloadAction<string>) => {
      state.dyte.currentDyteMeetingId = action.payload
    },
    setIsDyteMeetingLoading: (state, action: PayloadAction<boolean>) => {
      state.dyte.isDyteMeetingLoading = action.payload
    },

    setBreakoutNotify: (state, action: PayloadAction<boolean>) => {
      if (!state.dyte.isMeetingJoined) {
        return
      }
      state.breakout.breakoutNotify = action.payload
    },

    setRecordingLaunchModal: (state, action: PayloadAction<boolean>) => {
      if (!state.dyte.isMeetingJoined) {
        return
      }
      state.recording.notify = action.payload
    },

    // FOR POLL AND REFLECTIONS
    toggleStartAndStopActivity: (
      state,
      action: PayloadAction<{
        activity: string
        frameId: string | number
      }>
    ) => {
      if (!state.activeSession.data || state.activeSession.isSuccess !== true) {
        console.error('Session must be fetched before updating it.')

        return
      }
      const activityKey = `${action.payload.activity}Started`

      const framesConfig = state.activeSession.data?.data?.framesConfig || {}

      state.activeSession.data.data = {
        ...state.activeSession.data?.data,
        framesConfig: {
          ...framesConfig,
          [action.payload.frameId]: {
            [activityKey]:
              !state.activeSession.data?.data?.framesConfig?.[
                action.payload.frameId
              ]?.[activityKey],
          },
        },
      }
    },

    resetLiveSession: () => initialState,
  },
  extraReducers: (builder) => {
    attachThunkToBuilder({
      builder,
      thunk: getExistingOrCreateNewActiveSessionThunk,
      getThunkState: (state) => state.activeSession,
      keepDataWhileLoading: true,
    })
    attachThunkToBuilder({
      builder,
      thunk: getMeetingSessionThunk,
      getThunkState: (state) => state.activeSession,
      keepDataWhileLoading: true,
    })
    attachThunkToBuilder({
      builder,
      thunk: getExistingOrCreateNewParticipantThunk,
      getThunkState: (state) => state.participant,
    })
    attachThunkToBuilder({
      builder,
      thunk: getEnrollmentThunk,
      getThunkState: (state) => state.enrollment,
    })
  },
})

attachStoreListener({
  actionCreator: liveSessionSlice.actions.toggleStartAndStopActivity,
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
    const oldSessionData =
      getOriginalState().event.currentEvent.liveSessionState.activeSession.data
        ?.data
    const newSessionData =
      getState().event.currentEvent.liveSessionState.activeSession.data?.data
    const { currentFrameId, currentSectionId } =
      getState().event.currentEvent.eventState

    // If presentation status is changed
    if (
      oldSessionData?.presentationStatus === PresentationStatuses.STARTED &&
      newSessionData?.presentationStatus === PresentationStatuses.STOPPED
    ) {
      dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
    }

    if (
      oldSessionData?.presentationStatus === PresentationStatuses.STOPPED &&
      newSessionData?.presentationStatus === PresentationStatuses.STARTED
    ) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PRESENTATION))
    }

    if (newSessionData?.currentFrameId !== currentFrameId) {
      dispatch(setCurrentFrameIdAction(newSessionData?.currentFrameId || null))
    }
    if (newSessionData?.currentSectionId !== currentSectionId) {
      dispatch(
        setCurrentSectionIdAction(newSessionData?.currentSectionId || null)
      )
    }
  },
})

attachStoreListener({
  actionCreator: liveSessionSlice.actions.setIsInBreakout,
  effect: async (action, { dispatch }) => {
    if (action.payload) dispatch(collapseLeftSidebarAction())
  },
})

attachStoreListener({
  actionCreator: liveSessionSlice.actions.setDyteClient,
  effect: (action, { dispatch, getState, getOriginalState }) => {
    const dyteClient = action.payload
    if (!dyteClient) {
      const existingClient =
        getOriginalState().event.currentEvent.liveSessionState.dyte.dyteClient
      if (existingClient) {
        existingClient.connectedMeetings.removeAllListeners('*')
        existingClient.connectedMeetings.removeAllListeners('changingMeeting')
        existingClient.connectedMeetings.removeAllListeners('meetingChanged')
        existingClient.connectedMeetings.removeAllListeners('stateUpdate')
        existingClient.self.removeAllListeners('roomJoined')
        existingClient.self.removeAllListeners('roomLeft')
        existingClient.participants.removeAllListeners('broadcastedMessage')
      }

      return
    }
    const { eventId } = getState().event.currentEvent.eventState
    const meetingId =
      getState().event.currentEvent.meetingState.meeting.data?.id

    const dyteMeetingId = dyteClient.meta.meetingId

    dispatch(setCurrentDyteMeetingIdAction(dyteMeetingId))

    if (!action.payload?.connectedMeetings.parentMeeting?.id) {
      dispatch(
        getExistingOrCreateNewActiveSessionThunk({
          dyteMeetingId,
          meetingId,
        })
      )
    } else {
      dispatch(
        getMeetingSessionThunk({
          meetingId,
          dyteMeetingId,
        })
      )
    }

    const userPreferences = localStorage.getItem(
      USER_PREFERENCES_LOCAL_STORAGE_KEY
    )

    if (userPreferences) {
      const parsedPreferences = JSON.parse(userPreferences)

      const isVideoEnabled = parsedPreferences.meeting.video

      if (isVideoEnabled) {
        dyteClient.self.enableVideo()
      }
    }

    if (
      dyteClient.connectedMeetings?.parentMeeting &&
      dyteClient.meta.meetingId !==
        dyteClient.connectedMeetings?.parentMeeting?.id
    ) {
      dispatch(setIsInBreakoutAction(true))
    } else {
      dispatch(setIsInBreakoutAction(false))
    }
    const roomJoinedListener = () => {
      dispatch(setIsMeetingJoinedAction(true))
    }
    const roomLeftListener = () => {
      if (dyteClient.connectedMeetings.isActive) {
        if (
          !getState().event.currentEvent.liveSessionState.dyte
            .isDyteMeetingLoading
        ) {
          dispatch(setIsDyteMeetingLoadingAction(true))
        }

        return
      }
      dispatch(setIsMeetingJoinedAction(false))
    }
    const changingMeetingListener = () => {
      if (
        !getState().event.currentEvent.liveSessionState.dyte
          .isDyteMeetingLoading
      ) {
        dispatch(setIsDyteMeetingLoadingAction(true))
      }
    }
    const meetingChangedListener = () => {
      getRealtimeChannelForEvent(`${eventId}`)?.send({
        type: 'broadcast',
        event: 'participant-room-changed',
      })
      if (
        getState().event.currentEvent.liveSessionState.dyte.isDyteMeetingLoading
      ) {
        dispatch(setIsDyteMeetingLoadingAction(false))
      }
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
      getState().event.currentEvent.meetingState.meeting!.data!.id

    const connectedDyteMeetingId =
      getState().event.currentEvent.liveSessionState.dyte.dyteClient?.meta
        .meetingId

    const { eventId } = getState().event.currentEvent.eventState

    dispatch(
      liveSessionSlice.actions.silentUpdateMeetingSessionData(
        (action.payload as SessionModel)?.data as SessionState
      )
    )

    getRealtimeChannelForEvent(`${eventId}-3`)?.unsubscribe()

    if (!connectedDyteMeetingId) return

    supabaseClient
      .channel(`event:${eventId}-3`, { config: { broadcast: { self: false } } })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session',
          filter: `connected_dyte_meeting_id=eq.${connectedDyteMeetingId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (
          payload: RealtimePostgresChangesPayload<{
            data?: SessionState
            connect_dyte_meeting_id?: string
            id: string
          }>
        ) => {
          if (
            payload.eventType === 'INSERT' &&
            meetingId &&
            !getState().event.currentEvent.liveSessionState.breakout
              .isInBreakoutMeeting &&
            !getState().event.currentEvent.liveSessionState.breakout
              .isBreakoutActive &&
            !getState().event.currentEvent.liveSessionState.dyte
              .isDyteMeetingLoading &&
            connectedDyteMeetingId
          ) {
            dispatch(
              getMeetingSessionThunk({
                meetingId,
                dyteMeetingId: connectedDyteMeetingId,
              })
            )

            return
          }
          if (payload.eventType !== 'UPDATE') {
            return
          }
          if (!payload.new.data) return
          if (
            payload.new.id !==
            getState().event.currentEvent.liveSessionState.activeSession.data
              ?.id
          ) {
            return
          }
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
  setIsBreakoutOverviewOpenAction,
  setIsBreakoutActiveAction,
  setCurrentDyteMeetingIdAction,
  setIsDyteMeetingLoadingAction,
  setIsInBreakoutAction,
  setDyteClientAction,
  resetLiveSessionAction,
  setBreakoutNotifyAction,
  setRecordingLaunchModalAction,
  toggleStartAndStopActivityAction,
} = renameSliceActions(liveSessionSlice.actions)
