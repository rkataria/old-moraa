import { useCallback, useEffect, useRef } from 'react'

import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit'
import {
  DyteProvider,
  useDyteClient,
  useDyteMeeting,
} from '@dytesdk/react-web-core'
import { createFileRoute, useParams } from '@tanstack/react-router'
// eslint-disable-next-line import/no-extraneous-dependencies
import { debounce } from 'lodash'

import { Loading } from '@/components/common/Loading'
import { MeetingScreen } from '@/components/event-session/MeetingScreen/MeetingScreen'
import { MeetingSetupScreen } from '@/components/event-session/MeetingSetupScreen/MeetingSetupScreen'
import { BreakoutManagerContextProvider } from '@/contexts/BreakoutManagerContext'
import { EventProvider } from '@/contexts/EventContext'
import {
  EventSessionProvider,
  useEventSession,
} from '@/contexts/EventSessionContext'
import {
  RealtimeChannelProvider,
  useRealtimeChannel,
} from '@/contexts/RealtimeChannelContext'
import { useSyncValueInRedux } from '@/hooks/syncValueInRedux'
import { useTimer } from '@/hooks/use-timer'
import { useAskForHelp } from '@/hooks/useAskForHelp'
import { useBreakoutBroadcastMessage } from '@/hooks/useBreakoutBroadcastMessage'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useBreakoutSessionOver } from '@/hooks/useBreakoutSessionOver'
import { useEnsureEventEnrollment } from '@/hooks/useEnsureEventEnrollment'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useUserPreferences } from '@/hooks/userPreferences'
import {
  setCurrentEventIdAction,
  resetEventAction,
} from '@/stores/slices/event/current-event/event.slice'
import { resetFrameAction } from '@/stores/slices/event/current-event/frame.slice'
import {
  resetLiveSessionAction,
  setDyteClientAction,
  setIsBreakoutActiveAction,
} from '@/stores/slices/event/current-event/live-session.slice'
import { resetMeetingAction } from '@/stores/slices/event/current-event/meeting.slice'
import { resetMoraaSlideAction } from '@/stores/slices/event/current-event/moraa-slide.slice'
import { resetSectionAction } from '@/stores/slices/event/current-event/section.slice'
import { getEnrollmentThunk } from '@/stores/thunks/enrollment.thunk'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/event-session/$eventId/')({
  component: EventSessionPage,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad,
})

export function EventSessionPageInner() {
  useTimer()
  useBreakoutBroadcastMessage()
  useAskForHelp()
  useBreakoutSessionOver()
  const { meeting } = useDyteMeeting()
  const { eventRealtimeChannel } = useRealtimeChannel()
  const isRoomJoined = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )
  const isBreakoutLoading = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.dyte.isDyteMeetingLoading
  )
  const { isHost } = useEventSession()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const { isBreakoutActive } = useBreakoutRooms()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refetchConnectedMeetingsParticipants = useCallback(
    debounce(() => meeting.connectedMeetings.getConnectedMeetings(), 500),
    [meeting.connectedMeetings]
  )

  useSyncValueInRedux({
    value: isBreakoutActive,
    reduxStateSelector: (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutActive,
    actionFn: setIsBreakoutActiveAction,
  })

  useEffect(() => {
    if (!isHost) return
    eventRealtimeChannel?.on(
      'broadcast',
      { event: 'participant-room-changed' },
      () => refetchConnectedMeetingsParticipants()
    )
  }, [refetchConnectedMeetingsParticipants, eventRealtimeChannel, isHost])

  if (isBreakoutLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading
          message={
            isInBreakoutMeeting
              ? 'Exiting Breakout Room'
              : 'You are leaving main room to join breakout room'
          }
        />
      </div>
    )
  }

  if (isRoomJoined) {
    return <MeetingScreen />
  }

  return <MeetingSetupScreen />
}

function EventSessionPage() {
  const { userPreferences } = useUserPreferences()
  const { eventId } = useParams({ strict: false })
  const enrollment = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.enrollment.data
  )
  const meetingEl = useRef<HTMLDivElement>(null)
  const [dyteClient, initDyteMeeting] = useDyteClient()
  const dispatch = useStoreDispatch()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const isEventLoaded = useStoreSelector(
    (state) => state.event.currentEvent.eventState.event.isSuccess
  )
  const isMeetingLoaded = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.isSuccess
  )
  const isMeetingJoined = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )

  useSyncValueInRedux({
    value: dyteClient,
    reduxStateSelector: (state) =>
      state.event.currentEvent.liveSessionState.dyte.dyteClient,
    actionFn: setDyteClientAction,
  })
  useSyncValueInRedux({
    value: eventId || null,
    reduxStateSelector: (state) => state.event.currentEvent.eventState.eventId,
    actionFn: setCurrentEventIdAction,
  })

  const resetMeeting = useCallback(() => {
    dispatch(resetEventAction())
    dispatch(resetMeetingAction())
    dispatch(resetSectionAction())
    dispatch(resetFrameAction())
    dispatch(resetMoraaSlideAction())
    dispatch(resetLiveSessionAction())
  }, [dispatch])

  useEnsureEventEnrollment()

  useEffect(() => {
    if (!eventId) return

    dispatch(
      getEnrollmentThunk({
        eventId,
      })
    )

    // eslint-disable-next-line consistent-return
    return resetMeeting
  }, [dispatch, eventId, resetMeeting])

  useEffect(() => {
    if (eventId && dyteClient?.self.roomState === 'ended') {
      resetMeeting()
      dispatch(
        getEnrollmentThunk({
          eventId,
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, dyteClient?.self.roomState])

  useEffect(() => {
    if (!enrollment?.meeting_token) return
    if (!isEventLoaded || !isMeetingLoaded) return

    initDyteMeeting({
      authToken: enrollment.meeting_token,
      defaults: {
        audio: userPreferences?.meeting?.audio ?? true,
        video: userPreferences?.meeting?.video ?? true,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment?.meeting_token, isEventLoaded, isMeetingLoaded])

  useEffect(() => {
    if (!dyteClient) return () => null

    const onParticipantsListUpdate = () =>
      dyteClient.connectedMeetings.getConnectedMeetings()

    dyteClient.participants.active.addListener(
      'participantJoined',
      onParticipantsListUpdate
    )
    dyteClient.participants.active.addListener(
      'participantLeft',
      onParticipantsListUpdate
    )

    return () => {
      dyteClient.participants.active.removeListener(
        'participantJoined',
        onParticipantsListUpdate
      )
      dyteClient.participants.active.removeListener(
        'participantLeft',
        onParticipantsListUpdate
      )
    }
  }, [dyteClient])

  if (!enrollment?.meeting_token) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        {/* Actual message: Generating meeting token */}
        <Loading message="Finding your live session" />
      </div>
    )
  }

  if (meetingEl.current) {
    provideDyteDesignSystem(meetingEl.current, {
      googleFont: 'Outfit',
      // sets light background colors
      theme: 'light',
      colors: {
        danger: '#e40909',
        brand: {
          300: '#b089f4',
          400: '#9661f1',
          500: '#7c3aed',
          600: '#632ebe',
          700: '#4a238e',
        },
        text: '#000000',
        'text-on-brand': '#ffffff',
        'video-bg': '#0c0618',
      },
      borderRadius: 'rounded',
    })
  }

  return (
    <DyteProvider
      value={dyteClient}
      fallback={
        <div className="h-screen flex flex-col justify-center items-center">
          <Loading
            message={
              isMeetingJoined
                ? isInBreakoutMeeting
                  ? 'Exiting Breakout Room'
                  : 'Joining Breakout Room'
                : 'Joining the live session...'
            }
          />
        </div>
      }>
      <RealtimeChannelProvider>
        <BreakoutManagerContextProvider>
          <EventProvider eventMode="present">
            <EventSessionProvider>
              <div ref={meetingEl}>
                <EventSessionPageInner />
              </div>
            </EventSessionProvider>
          </EventProvider>
        </BreakoutManagerContextProvider>
      </RealtimeChannelProvider>
    </DyteProvider>
  )
}
