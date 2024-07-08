import { useEffect, useState } from 'react'

import DyteClient from '@dytesdk/web-core'
import { useRouter } from 'next/navigation'

export const useDyteListeners = (dyteMeeting: DyteClient | undefined) => {
  const router = useRouter()
  const [isBreakoutLoading, setIsBreakoutLoading] = useState<boolean>(false)
  const [isRoomJoined, setRoomJoined] = useState<boolean>(false)

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

  return { isBreakoutLoading, isRoomJoined }
}
