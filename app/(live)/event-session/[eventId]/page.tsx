/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useEffect, useRef, useState } from 'react'

import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit'
import {
  DyteProvider,
  useDyteClient,
  useDyteSelector,
} from '@dytesdk/react-web-core'
import DyteClient from '@dytesdk/web-core'
import { useParams, useRouter } from 'next/navigation'

import { Loading } from '@/components/common/Loading'
import { MeetingScreen } from '@/components/event-session/MeetingScreen'
import { MeetingSetupScreen } from '@/components/event-session/MeetingSetupScreen'
import { BreakoutRoomsManagerProvider } from '@/contexts/BreakoutRoomsManagerContext'
import { EventProvider } from '@/contexts/EventContext'
import { EventSessionProvider } from '@/contexts/EventSessionContext'
import { useEnrollment } from '@/hooks/useEnrollment'

type EventSessionPageInnerProps = {
  roomJoined: boolean
  isBreakoutLoading: boolean
  // setIsBreakoutLoading: (loading: boolean) => void
}

function EventSessionPageInner({
  roomJoined,
  isBreakoutLoading,
  // setIsBreakoutLoading,
}: EventSessionPageInnerProps) {
  useBreakoutRoom()

  if (isBreakoutLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading message="Joining Breakout Room" />
      </div>
    )
  }
  // console.log('EventSessionPageInner isBreakoutLoading', isBreakoutLoading)

  if (roomJoined) {
    return (
      <BreakoutRoomsManagerProvider>
        <MeetingScreen />
      </BreakoutRoomsManagerProvider>
    )
  }

  return <MeetingSetupScreen />
}

const useBreakoutRoom = () => {
  // const { realtimeChannel } = useContext(
  //   EventSessionContext
  // ) as EventSessionContextType
  const dyteMeeting = useDyteSelector((m) => m)
  const connectedMeetingsIsActive = useDyteSelector(
    (m) => m.connectedMeetings.isActive
  )
  const connectedMeetings = useDyteSelector((m) => m.connectedMeetings.meetings)
  const dyteMeetingId = useDyteSelector((m) => m.meta.meetingId)
  // const parentMeeting = useDyteSelector(
  //   (m) => m.connectedMeetings.parentMeeting
  // )
  const roomJoined = useDyteSelector((m) => m.self.roomJoined)
  // const router = useRouter()
  // const meetingParticipants = useDyteSelector((m) => m.participants)
  // const parentMeetingParticipants = useDyteSelector(
  //   (m) => m.connectedMeetings.parentMeeting?.participants
  // )

  // const [breakoutRoomCreatedAt, setBreakoutRoomCreatedAt] = useState<
  //   string | null
  // >()

  // useEffect(() => {
  //   if (!realtimeChannel) return

  //   realtimeChannel.on(
  //     'broadcast',
  //     { event: 'breakout-room-created' },
  //     ({ payload }) => {
  //       console.log('Received breakout-room-created', payload)
  //       setBreakoutRoomCreatedAt(payload.createdAt || 1)
  //     }
  //   )
  // }, [])

  // console.log('useBreakoutRoom: roomJoined', roomJoined)

  useEffect(() => {
    console.log('Changed connectedMeetings.meetings', connectedMeetings)
  }, [connectedMeetings])

  useEffect(() => {
    if (!dyteMeeting) return
    if (!dyteMeetingId) return
    // if (!isBreakoutLoading) return

    // if (dyteMeeting.connectedMeetings.isActive) {
    //   // router.refresh()
    // }

    if (connectedMeetingsIsActive && !roomJoined) {
      // if (roomJoined) return

      dyteMeeting.join()
      // setIsBreakoutLoading(() => false)
    }

    // console.log(
    //   'useEffect (join-breakout-room): dyteMeeting.meta.meetingId',
    //   dyteMeeting.meta.meetingId
    // )
    // console.log(
    //   'useEffect (join-breakout-room): dyteMeeting.self.id',
    //   dyteMeeting.self.id
    // )

    // console.log(
    //   'useEffect (join-breakout-room): meetingParticipants',
    //   meetingParticipants
    // )
    // console.log(
    //   'useEffect (join-breakout-room): parentMeetingParticipants',
    //   parentMeetingParticipants
    // )

    // console.log(
    //   'useEffect (join-breakout-room): roomJoined',
    //   dyteMeeting.meta.meetingId,
    //   dyteMeeting.self.id
    // )
    // console.log('useEffect (join-breakout-room): parentMeeting', parentMeeting)
    // console.log(
    //   'useEffect (join-breakout-room): connectedMeetings',
    //   connectedMeetings
    // )

    // const possibleMeetingsWithCurrentParticipant = [
    //   ...connectedMeetings,
    //   ...(parentMeeting ? [parentMeeting] : []),
    // ]

    // console.log(
    //   'useEffect (join-breakout-room): possibleMeetingsWithCurrentParticipant',
    //   possibleMeetingsWithCurrentParticipant
    // )

    // const currentParticipantId = dyteMeeting.self.customParticipantId

    // console.log(
    //   'useEffect (join-breakout-room): currentParticipantId',
    //   currentParticipantId
    // )

    // const meetingWithCurrentParticipant =
    //   possibleMeetingsWithCurrentParticipant.find((m) =>
    //     m.participants
    //       .filter(Boolean)
    //       .some((p) => p.customParticipantId === currentParticipantId)
    //   )

    // console.log(
    //   'useEffect (join-breakout-room): meetingWithCurrentParticipant',
    //   meetingWithCurrentParticipant
    // )

    // if (!meetingWithCurrentParticipant) return

    // const currentParticipant = meetingWithCurrentParticipant.participants.find(
    //   (participant) => participant.customParticipantId === currentParticipantId
    // )

    // console.log(
    //   'useEffect (join-breakout-room): currentParticipant',
    //   currentParticipant
    // )

    // if (!currentParticipant) return

    // console.log(
    //   'useEffect (join-breakout-room): setting meeting self name',
    // )
    // dyteMeeting.self.setName(currentParticipant.displayName!)

    // console.log('useEffect (join-breakout-room): joining meeting NOW')
    // dyteMeeting.join()
    // console.log('useEffect (join-breakout-room): 🎉 joined')

    // setRoomJoined(() => true)
  }, [
    dyteMeeting,
    connectedMeetingsIsActive,
    dyteMeetingId,
    // connectedMeetings,
    roomJoined,
    // isBreakoutLoading,
    // setIsBreakoutLoading,
    // router,
  ])
}

const useDyteListeners = (
  dyteMeeting: DyteClient | undefined,
  setRoomJoined: (roomJoined: boolean) => void
) => {
  const router = useRouter()
  useEffect(() => {
    if (!dyteMeeting) return

    const roomJoinedListener = () => {
      console.log(
        'roomJoinedListener: roomJoined, meetingId',
        dyteMeeting.meta.meetingId
      )
      setRoomJoined(true)
    }
    const roomLeftListener = () => {
      console.log(
        'roomLeftListener: meeting.connectedMeetings.isActive',
        dyteMeeting.connectedMeetings.isActive
      )
      if (dyteMeeting.connectedMeetings.isActive) {
        // setIsBreakoutLoading(true)
        console.log(
          'roomLeftListener: dyteMeeting.connectedMeetings.meetings',
          dyteMeeting.connectedMeetings.meetings
        )
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
    const meetingChangedListener = (...args: any[]) => {
      console.log('meetingChanged', args)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changingMeetingListener = (...args: any[]) => {
      console.log('changingMeeting', args)
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
  // const [dyteMeetingRetriggeredAt, setDyteMeetingRetriggeredAt] =
  //   useState<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isBreakoutLoading, setIsBreakoutLoading] = useState<boolean>(false)
  useDyteListeners(dyteMeeting, setRoomJoined)

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

  // console.log('roomJoined', roomJoined)
  // console.log('isBreakoutLoading', isBreakoutLoading)

  return (
    <DyteProvider
      value={dyteMeeting}
      fallback={
        <div className="h-screen flex flex-col justify-center items-center">
          <Loading message="Joining the live session..." />
        </div>
      }>
      <EventProvider eventMode="present">
        <EventSessionProvider>
          <div ref={meetingEl}>
            <EventSessionPageInner
              roomJoined={roomJoined}
              // setRoomJoined={setRoomJoined}
              isBreakoutLoading={isBreakoutLoading}
              // setIsBreakoutLoading={setIsBreakoutLoading}
            />
          </div>
        </EventSessionProvider>
      </EventProvider>
    </DyteProvider>
  )
}

export default EventSessionPage
