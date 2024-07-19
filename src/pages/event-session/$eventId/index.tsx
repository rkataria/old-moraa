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
import { useDyteListeners } from '@/hooks/useDyteBreakoutListeners'
import { useEnrollment } from '@/hooks/useEnrollment'

type EventSessionPageInnerProps = {
  roomJoined: boolean
  isBreakoutLoading: boolean
}

export const Route = createFileRoute('/event-session/$eventId/')({
  component: EventSessionPage,
})

export function EventSessionPageInner({
  roomJoined,
  isBreakoutLoading,
}: EventSessionPageInnerProps) {
  // useBreakoutRoom()
  if (isBreakoutLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading message="Joining Breakout Room" />
      </div>
    )
  }

  if (roomJoined) {
    return <MeetingScreen />
  }

  return <MeetingSetupScreen />
}

function EventSessionPage() {
  const { eventId } = useParams({ strict: false })
  const { enrollment } = useEnrollment({
    eventId: eventId as string,
  })
  const meetingEl = useRef<HTMLDivElement>(null)
  const [dyteMeeting, initDyteMeeting] = useDyteClient()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { isBreakoutLoading, isRoomJoined } = useDyteListeners(dyteMeeting)

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
      googleFont: 'Inter',
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
      value={dyteMeeting}
      fallback={
        <div className="h-screen flex flex-col justify-center items-center">
          <Loading message="Joining the live session..." />
        </div>
      }>
      <BreakoutManagerContextProvider meeting={dyteMeeting}>
        <EventProvider eventMode="present">
          <EventSessionProvider>
            <div ref={meetingEl}>
              <EventSessionPageInner
                roomJoined={isRoomJoined}
                isBreakoutLoading={isBreakoutLoading}
              />
            </div>
          </EventSessionProvider>
        </EventProvider>
      </BreakoutManagerContextProvider>
    </DyteProvider>
  )
}
