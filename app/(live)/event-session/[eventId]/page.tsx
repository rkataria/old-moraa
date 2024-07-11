/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useEffect, useRef, useState } from 'react'

import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit'
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import DyteClient from '@dytesdk/web-core'
import { useParams, useRouter } from 'next/navigation'

import { Loading } from '@/components/common/Loading'
import { MeetingScreen } from '@/components/event-session/MeetingScreen'
import { MeetingSetupScreen } from '@/components/event-session/MeetingSetupScreen'
import ProtectedLayout from '@/components/hoc/ProtectedLayout'
import { BreakoutManagerContextProvider } from '@/contexts/BreakoutManagerContext'
import { BreakoutRoomsManagerProvider } from '@/contexts/BreakoutRoomsManagerContext'
import { EventProvider } from '@/contexts/EventContext'
import { EventSessionProvider } from '@/contexts/EventSessionContext'
import { useEnrollment } from '@/hooks/useEnrollment'

type EventSessionPageInnerProps = {
  roomJoined: boolean
  isBreakoutLoading: boolean
}

function EventSessionPageInner({
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
    return (
      <BreakoutRoomsManagerProvider>
        <MeetingScreen />
      </BreakoutRoomsManagerProvider>
    )
  }

  return <MeetingSetupScreen />
}

const useDyteListeners = (
  dyteMeeting: DyteClient | undefined,
  setRoomJoined: (roomJoined: boolean) => void,
  setIsBreakoutLoading: (isLoading: boolean) => void
) => {
  const router = useRouter()

  useEffect(() => {
    if (!dyteMeeting) return

    const roomJoinedListener = () => {
      setRoomJoined(true)
    }
    const roomLeftListener = () => {
      if (dyteMeeting.connectedMeetings.isActive) {
        setIsBreakoutLoading(true)
        router.refresh()

        return
      }
      setRoomJoined(false)
      // eslint-disable-next-line no-console
      console.log('room left')
      router.push('/events')
    }
    dyteMeeting.self.on('roomJoined', roomJoinedListener)
    dyteMeeting.self.on('roomLeft', roomLeftListener)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meetingChangedListener = () => {
      setIsBreakoutLoading(false)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changingMeetingListener = () => {
      setIsBreakoutLoading(true)
    }
    dyteMeeting.connectedMeetings.on('meetingChanged', meetingChangedListener)
    dyteMeeting.connectedMeetings.on('changingMeeting', changingMeetingListener)

    // eslint-disable-next-line consistent-return
    return () => {
      dyteMeeting.self.removeListener('roomJoined', roomJoinedListener)
      dyteMeeting.self.removeListener('roomLeft', roomLeftListener)
      dyteMeeting.connectedMeetings.removeListener(
        'meetingChanged',
        meetingChangedListener
      )
      dyteMeeting.connectedMeetings.removeListener(
        'changingMeeting',
        changingMeetingListener
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dyteMeeting])
}

function EventSessionPage() {
  const { eventId } = useParams()
  const { enrollment } = useEnrollment({
    eventId: eventId as string,
  })
  const meetingEl = useRef<HTMLDivElement>(null)
  const [dyteMeeting, initDyteMeeting] = useDyteClient()
  const [roomJoined, setRoomJoined] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isBreakoutLoading, setIsBreakoutLoading] = useState<boolean>(false)

  useDyteListeners(dyteMeeting, setRoomJoined, setIsBreakoutLoading)

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
                roomJoined={roomJoined}
                isBreakoutLoading={isBreakoutLoading}
              />
            </div>
          </EventSessionProvider>
        </EventProvider>
      </BreakoutManagerContextProvider>
    </DyteProvider>
  )
}

export default function ProtectedEventSessionPage() {
  return (
    <ProtectedLayout>
      <EventSessionPage />
    </ProtectedLayout>
  )
}
