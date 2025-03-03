import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Chip } from '@heroui/react'
import groupBy from 'lodash.groupby'

import { Card } from './Card'
import { ParticipantView } from './ParticipantView'
import { SelfCard } from './SelfCard'
import { TypingUserCards } from './TypingUserCards'

import type { IFrame, IReflectionResponse } from '@/types/frame.type'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { SideImageLayout } from '@/components/common/SideImageLayout'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useProfile } from '@/hooks/useProfile'
import { useStoreSelector } from '@/hooks/useRedux'
import { getAvatarForName } from '@/utils/utils'

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

  return (
    <>
      <SelfCard
        username={username}
        avatarUrl={user.user_metadata.avatar_url}
        selfResponse={undefined}
        totalResponsesCount={selfResponses.length}
      />

      {selfResponses.map((selfResponse) => (
        <SelfCard
          username={username}
          avatarUrl={user.user_metadata.avatar_url}
          selfResponse={selfResponse}
        />
      ))}

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
    </>
  )
}

export function Live() {
  const { isHost, currentFrame } = useEventSession()

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  if (!currentFrame) return null

  const reflectionStarted =
    session?.data?.framesConfig?.[currentFrame.id]?.reflectionStarted

  return (
    <SideImageLayout imageConfig={currentFrame.config.image}>
      <div className="flex flex-col h-full gap-4 overflow-auto scrollbar-none">
        <FrameTitleDescriptionPreview
          frame={currentFrame as IFrame}
          afterTitle={
            <Chip
              variant="flat"
              size="sm"
              className="rounded-lg -translate-y-1.5 translate-x-4"
              color={reflectionStarted ? 'success' : 'warning'}>
              {reflectionStarted
                ? 'Reflection is active'
                : 'Reflection is closed'}
            </Chip>
          }
        />
        <div className="border border flex-1 rounded-md border border-gray-200 p-4">
          <div className="w-full h-[auto] grid grid-cols-[repeat(auto-fill,_minmax(270px,_1fr))] gap-4">
            {isHost ? <HostView /> : <ParticipantView />}
          </div>
        </div>
      </div>
    </SideImageLayout>
  )
}
