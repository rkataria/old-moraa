import { Fragment } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import groupBy from 'lodash.groupby'

import { Card } from './Card'
import { SelfCard } from './SelfCard'
import { TypingUserCards } from './TypingUserCards'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { IReflectionResponse } from '@/types/frame.type'
import { getAvatarForName } from '@/utils/utils'

export function ParticipantView() {
  const { currentFrameResponses = [] } = useEventSession()
  const { currentUser: user } = useAuth()
  const { meeting: dyteMeeting } = useDyteMeeting()
  const username = useDyteSelector((m) => m.self.name)
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
    <Fragment key={key}>
      <SelfCard
        username={username}
        selfResponse={selfResponse}
        avatarUrl={getAvatarForName(username, user.user_metadata.avatar_url)}
      />
      {otherResponses.map((res) => (
        <Card
          key={res.id}
          response={res}
          isOwner={false}
          userName={username}
          avatarUrl={getAvatarForName(username, user.user_metadata.avatar_url)}
        />
      ))}
      <TypingUserCards />
    </Fragment>
  )
}
