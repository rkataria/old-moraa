/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useEffect, useRef, useState } from 'react'

import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit'
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import { useParams, useRouter } from 'next/navigation'

import { Loading } from '@/components/common/Loading'
import { MeetingScreen } from '@/components/event-session/MeetingScreen'
import { MeetingSetupScreen } from '@/components/event-session/MeetingSetupScreen'
import { EventSessionProvider } from '@/contexts/EventSessionContext'
import { useEnrollment } from '@/hooks/useEnrollment'

function EventSessionPage() {
  const router = useRouter()
  const { eventId } = useParams()
  const { enrollment } = useEnrollment({
    eventId: eventId as string,
  })
  const meetingEl = useRef<HTMLDivElement>(null)
  const [meeting, initMeeting] = useDyteClient()
  const [roomJoined, setRoomJoined] = useState<boolean>(false)

  useEffect(() => {
    if (!enrollment?.meeting_token) return

    initMeeting({
      authToken: enrollment.meeting_token,
      defaults: {
        audio: true,
        video: true,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment?.meeting_token])

  useEffect(() => {
    if (!meetingEl.current) return

    provideDyteDesignSystem(meetingEl.current, {
      googleFont: 'Inter',
      // sets light background colors
      // theme: 'dark',
      // colors: {
      //   danger: '#ffac00',
      //   brand: {
      //     300: '#00FFE1',
      //     400: '#00FFFF',
      //     500: '#00E1D4',
      //     600: '#007B74',
      //     700: '#00655F',
      //   },
      //   text: '#071428',
      //   'text-on-brand': '#ffffff',
      //   'video-bg': '#E5E7EB',
      // },
      // borderRadius: 'sharp',
    })
  }, [enrollment?.meeting_token])

  useEffect(() => {
    if (!meeting) return

    const roomJoinedListener = () => {
      setRoomJoined(true)
    }
    const roomLeftListener = () => {
      setRoomJoined(false)
      // eslint-disable-next-line no-console
      console.log('room left')
      router.push('/events')
    }
    meeting.self.on('roomJoined', roomJoinedListener)
    meeting.self.on('roomLeft', roomLeftListener)

    // eslint-disable-next-line consistent-return
    return () => {
      meeting.self.removeListener('roomJoined', roomJoinedListener)
      meeting.self.removeListener('roomLeft', roomLeftListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting])

  if (!enrollment?.meeting_token) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  return (
    <EventSessionProvider>
      <div ref={meetingEl}>
        <DyteProvider
          value={meeting}
          fallback={
            <div className="h-screen flex justify-center items-center">
              <Loading />
            </div>
          }>
          {roomJoined ? <MeetingScreen /> : <MeetingSetupScreen />}
        </DyteProvider>
      </div>
    </EventSessionProvider>
  )
}

export default EventSessionPage
