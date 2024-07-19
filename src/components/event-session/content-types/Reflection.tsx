import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import groupBy from 'lodash.groupby'

import { ReflectionCard } from './reflection/ReflectionCard'
import { SelfReflectionCard } from './reflection/SelfReflectionCard'
import { TypingUsers } from './reflection/TypingUsers'

import type { IReflectionFrame, IReflectionResponse } from '@/types/frame.type'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useProfile } from '@/hooks/useProfile'

interface ReflectionProps {
  frame: IReflectionFrame
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
  const { currentFrameResponses = [] } = useEventSession()
  const { currentUser: user } = useAuth()
  const { username } = useParticipantName()
  const { meeting: dyteMeeting } = useDyteMeeting()
  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()

  const getResponses = () => {
    const typedResponses = currentFrameResponses as IReflectionResponse[]
    if (isBreakoutActive && isCurrentDyteMeetingInABreakoutRoom) {
      return typedResponses?.filter(
        (r) => r.dyte_meeting_id === dyteMeeting.meta.meetingId
      )
    }

    return currentFrameResponses as IReflectionResponse[]
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
      <SelfReflectionCard
        username={username}
        avatarUrl={user.avatar_url}
        selfResponse={selfResponse}
      />
      {otherResponses.map((res) => (
        <ReflectionCard key={res.id} response={res} isOwner={false} />
      ))}
      <TypingUsers />
    </div>
  )
}

function ParticipantView() {
  const { currentFrameResponses = [] } = useEventSession()
  const { currentUser: user } = useAuth()
  const { username } = useParticipantName()

  const { meeting: dyteMeeting } = useDyteMeeting()
  const dyteMeetingId = useDyteSelector((m) => m.meta.meetingId)
  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()

  const getResponses = () => {
    const typedResponses = currentFrameResponses as IReflectionResponse[]
    if (isBreakoutActive && isCurrentDyteMeetingInABreakoutRoom) {
      return typedResponses?.filter(
        (r) => r.dyte_meeting_id === dyteMeeting.meta.meetingId
      )
    }

    return currentFrameResponses as IReflectionResponse[]
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

export function Reflection({ frame }: ReflectionProps) {
  const { isHost } = useEventSession()

  return (
    <div
      className="w-full flex justify-center items-start"
      style={{
        backgroundColor: frame.content.backgroundColor,
      }}>
      <div className="w-4/5 mt-2 rounded-md relative">
        <div className="p-4">
          {/* <FrameTitle
            textColor={frame.content.textColor}
            title={frame.content.title}
          /> */}
          {isHost ? <HostView /> : <ParticipantView />}
        </div>
      </div>
    </div>
  )
}
