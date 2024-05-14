'use client'

import React from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import groupBy from 'lodash.groupby'

import { BreakoutRoomStatus } from './reflection/BreakoutRoomStatus'
import { ReflectionCard } from './reflection/ReflectionCard'
import { SelfReflectionCard } from './reflection/SelfReflectionCard'
import { StartBreakoutRoomsButtonWithModal } from './reflection/StartBreakoutRoomsButtonWithModal'
import { StopBreakoutRoomsButtonWithModal } from './reflection/StopBreakoutRoomsButtonWithModal'
import { TypingUsers } from './reflection/TypingUsers'

import type { IReflectionSlide, IReflectionResponse } from '@/types/slide.type'

import { useBreakoutRooms } from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

interface ReflectionProps {
  slide: IReflectionSlide
}

const useParticipantName = () => {
  const { data: profile } = useProfile()
  const selfParticipant = useDyteSelector((m) => m.self)

  if (!profile) {
    return { username: selfParticipant.name }
  }

  return { username: `${profile.first_name} ${profile.last_name}` }
}

function HostView() {
  const { currentSlideResponses = [] } = useEventSession()
  const { currentUser: user } = useAuth()
  const { username } = useParticipantName()
  const { meeting: dyteMeeting } = useDyteMeeting()
  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()

  const getResponses = () => {
    const typedResponses = currentSlideResponses as IReflectionResponse[]
    if (isBreakoutActive && isCurrentDyteMeetingInABreakoutRoom) {
      return typedResponses.filter(
        (r) => r.dyte_meeting_id === dyteMeeting.meta.meetingId
      )
    }

    return currentSlideResponses as IReflectionResponse[]
  }

  const responses = getResponses()

  const isSelfResponseForCurrentDyteMeeting = (response: IReflectionResponse) =>
    response.participant.enrollment.user_id === user.id &&
    response.dyte_meeting_id === dyteMeeting.meta.meetingId

  const { selfResponses = [], otherResponses = [] } = groupBy(responses, (r) =>
    isSelfResponseForCurrentDyteMeeting(r) ? 'selfResponses' : 'otherResponses'
  )

  const selfResponse = selfResponses[0] as IReflectionResponse | undefined

  return (
    <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
      <SelfReflectionCard username={username} selfResponse={selfResponse} />
      {otherResponses.map((res) => (
        <ReflectionCard key={res.id} response={res} isOwner={false} />
      ))}
      <TypingUsers />
    </div>
  )
}

function ParticipantView() {
  const { currentSlideResponses = [] } = useEventSession()
  const { currentUser: user } = useAuth()
  const { username } = useParticipantName()

  const { meeting: dyteMeeting } = useDyteMeeting()
  const dyteMeetingId = useDyteSelector((m) => m.meta.meetingId)
  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()

  const getResponses = () => {
    const typedResponses = currentSlideResponses as IReflectionResponse[]
    if (isBreakoutActive && isCurrentDyteMeetingInABreakoutRoom) {
      return typedResponses.filter(
        (r) => r.dyte_meeting_id === dyteMeeting.meta.meetingId
      )
    }

    return currentSlideResponses as IReflectionResponse[]
  }

  const responses = getResponses()

  const isSelfResponseForCurrentDyteMeeting = (response: IReflectionResponse) =>
    response.participant.enrollment.user_id === user.id &&
    response.dyte_meeting_id === dyteMeeting.meta.meetingId

  const { selfResponses = [], otherResponses = [] } = groupBy(responses, (r) =>
    isSelfResponseForCurrentDyteMeeting(r) ? 'selfResponses' : 'otherResponses'
  )

  const selfResponse = selfResponses[0] as IReflectionResponse | undefined

  // NOTE: This is important to make sure the component re-renders when the breakout room status changes
  // So that we get the latest participant data
  const key = `dm-${dyteMeetingId}-br-${JSON.stringify(isBreakoutActive)}`

  return (
    <div key={key}>
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
        <SelfReflectionCard username={username} selfResponse={selfResponse} />
        {otherResponses.map((res) => (
          <ReflectionCard key={res.id} response={res} isOwner={false} />
        ))}
        <TypingUsers />
      </div>
    </div>
  )
}

export function Reflection({ slide }: ReflectionProps) {
  const { isHost } = useEventSession()

  return (
    <div
      className="w-full flex justify-center items-start"
      style={{
        backgroundColor: slide.content.backgroundColor,
      }}>
      <div className="w-4/5 mt-2 rounded-md relative">
        <div className="w-full flex justify-center">
          <div className="flex gap-2 items-center">
            <StartBreakoutRoomsButtonWithModal />
            <StopBreakoutRoomsButtonWithModal />
            <BreakoutRoomStatus />
          </div>
        </div>

        <div className="p-4">
          {/* <SlideTitle
            textColor={slide.content.textColor}
            title={slide.content.title}
          /> */}
          {isHost ? <HostView /> : <ParticipantView />}
        </div>
      </div>
    </div>
  )
}
