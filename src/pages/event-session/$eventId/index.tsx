import { useEffect, useRef } from 'react'

import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit'
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import { createFileRoute, useParams } from '@tanstack/react-router'

import { Loading } from '@/components/common/Loading'
import { MeetingScreen } from '@/components/event-session/MeetingScreen'
import { MeetingSetupScreen } from '@/components/event-session/MeetingSetupScreen'
import { BreakoutManagerContextProvider } from '@/contexts/BreakoutManagerContext'
import { EventProvider } from '@/contexts/EventContext'
import { EventSessionProvider } from '@/contexts/EventSessionContext'
import { useEnrollment } from '@/hooks/useEnrollment'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  removeDyteClientAction,
  setDyteClientAction,
} from '@/stores/slices/event/current-event/live-session.slice'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/event-session/$eventId/')({
  component: EventSessionPage,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad,
})

export function EventSessionPageInner() {
  const isRoomJoined = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.isMeetingJoined
  )
  const isBreakoutLoading = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.isDyteMeetingLoading
  )
  if (isBreakoutLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading message="Joining Breakout Room" />
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
  const dispatch = useStoreDispatch()
  const { enrollment } = useEnrollment({
    eventId: eventId as string,
  })
  const meetingEl = useRef<HTMLDivElement>(null)
  const [dyteClient, initDyteMeeting] = useDyteClient()

  useEffect(() => {
    if (dyteClient) {
      dispatch(setDyteClientAction(dyteClient))
    } else {
      dispatch(removeDyteClientAction())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dyteClient])

  useEffect(() => {
    if (!enrollment?.meeting_token) return

    initDyteMeeting({
      authToken: enrollment.meeting_token,
      defaults: {
        audio: true,
        video: true,
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
          <Loading message="Joining the live session..." />
        </div>
      }>
      <BreakoutManagerContextProvider dyteClient={dyteClient}>
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
