import { useEffect, useRef } from 'react'

import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit'
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import { createFileRoute, useParams } from '@tanstack/react-router'

import { Loading } from '@/components/common/Loading'
import { MeetingScreen } from '@/components/event-session/MeetingScreen/MeetingScreen'
import { MeetingSetupScreen } from '@/components/event-session/MeetingSetupScreen/MeetingSetupScreen'
import { BreakoutManagerContextProvider } from '@/contexts/BreakoutManagerContext'
import { EventProvider } from '@/contexts/EventContext'
import { EventSessionProvider } from '@/contexts/EventSessionContext'
import { useSyncValueInRedux } from '@/hooks/syncValueInRedux'
import { useTimer } from '@/hooks/use-timer'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { resetEventAction } from '@/stores/slices/event/current-event/event.slice'
import { resetFrameAction } from '@/stores/slices/event/current-event/frame.slice'
import {
  resetLiveSessionAction,
  setDyteClientAction,
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
  const isRoomJoined = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )
  const isBreakoutLoading = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.dyte.isDyteMeetingLoading
  )
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  if (isBreakoutLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading
          message={
            isInBreakoutMeeting
              ? 'Exiting Breakout Room'
              : 'Joining Breakout Room'
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
  const isMeetingJoined = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )

  useTimer()

  useSyncValueInRedux({
    value: dyteClient,
    reduxStateSelector: (state) =>
      state.event.currentEvent.liveSessionState.dyte.dyteClient,
    actionFn: setDyteClientAction,
  })

  useEffect(() => {
    if (!eventId) return

    dispatch(
      getEnrollmentThunk({
        eventId,
      })
    )

    // eslint-disable-next-line consistent-return
    return () => {
      dispatch(resetEventAction())
      dispatch(resetMeetingAction())
      dispatch(resetSectionAction())
      dispatch(resetFrameAction())
      dispatch(resetMoraaSlideAction())
      dispatch(resetLiveSessionAction())
    }
  }, [dispatch, eventId])

  useEffect(() => {
    if (!enrollment?.meeting_token) return

    initDyteMeeting({
      authToken: enrollment.meeting_token,
      defaults: {
        audio: false,
        video: false,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment?.meeting_token])

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
      <BreakoutManagerContextProvider>
        <EventProvider eventMode="present">
          <EventSessionProvider>
            <div ref={meetingEl}>
              <EventSessionPageInner />
            </div>
          </EventSessionProvider>
        </EventProvider>
      </BreakoutManagerContextProvider>
    </DyteProvider>
  )
}
