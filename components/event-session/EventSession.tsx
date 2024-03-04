import { useEffect, useRef, useState } from 'react'

import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import { useRouter } from 'next/navigation'

import { Loading } from '@/components/common/Loading'
import { MeetingScreen } from '@/components/event-session/MeetingScreen'
import { MeetingSetupScreen } from '@/components/event-session/MeetingSetupScreen'
import { EventSessionProvider } from '@/contexts/EventSessionContext'

export type EventSessionProps = {
  meetingToken: string
}

export function EventSession({ meetingToken }: EventSessionProps) {
  const router = useRouter()
  const meetingEl = useRef<HTMLDivElement>(null)
  const [meeting, initMeeting] = useDyteClient()
  const [roomJoined, setRoomJoined] = useState<boolean>(false)

  useEffect(() => {
    initMeeting({
      authToken: meetingToken,
      defaults: {
        audio: true,
        video: true,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const renderComponents = () => {
    if (roomJoined) {
      return <MeetingScreen />
    }

    return <MeetingSetupScreen />
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
          <>{renderComponents()}</>
        </DyteProvider>
      </div>
    </EventSessionProvider>
  )
}
