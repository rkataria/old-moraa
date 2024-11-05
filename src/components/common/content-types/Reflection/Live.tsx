import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import groupBy from 'lodash.groupby'

import { Card } from './Card'
import { ParticipantView } from './ParticipantView'
import { SelfCard } from './SelfCard'
import { TypingUserCards } from './TypingUserCards'
import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'

import type { IFrame, IReflectionResponse } from '@/types/frame.type'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useProfile } from '@/hooks/useProfile'

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
    <>
      <SelfCard
        username={username}
        avatarUrl={user.avatar_url}
        selfResponse={selfResponse}
      />
      {otherResponses.map((res) => (
        <Card key={res.id} response={res} isOwner={false} />
      ))}
      <TypingUserCards />
    </>
  )
}

export function Live() {
  const { isHost, currentFrame } = useEventSession()

  return (
    <>
      <FrameTitleDescriptionPreview frame={currentFrame as IFrame} />
      <div className="w-full h-full flex justify-start items-start bg-white rounded-md">
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-4">
          {isHost ? <HostView /> : <ParticipantView />}
        </div>
      </div>
    </>
  )
}
