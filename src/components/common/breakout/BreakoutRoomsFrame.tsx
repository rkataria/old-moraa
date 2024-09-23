/* eslint-disable jsx-a11y/control-has-associated-label */

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { Button } from '@nextui-org/react'

import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { EndBreakoutButton } from './EndBreakoutButton'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'

export function BreakoutRoomsWithParticipants({
  hideActivityCards,
}: {
  hideActivityCards?: boolean
}) {
  const { getFrameById } = useEventContext()
  const { meeting } = useDyteMeeting()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const breakoutFrameId = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId
  )

  const joinRoom = (meetId: string) => {
    breakoutRoomsInstance?.joinRoom(meetId)
  }

  const breakoutFrame = getFrameById(breakoutFrameId!)

  return (
    <div className="w-full flex-1">
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3 overflow-y-auto">
        {meeting.connectedMeetings.meetings.map((meet, index) => (
          <BreakoutRoomActivityCard
            idx={index}
            breakout={{
              activityId:
                breakoutFrame?.content?.activityId ||
                breakoutFrame?.content?.groupActivityId,
              name: breakoutFrame?.content?.groupActivityId
                ? ''
                : breakoutFrame?.content?.title,
            }}
            editable={false}
            hideActivityCard={hideActivityCards}
            participants={meet.participants?.map((p) => ({
              displayName: p?.displayName || '',
              id: p?.id || '',
              displayPictureUrl: p?.displayPictureUrl || '',
            }))}
            JoinRoomButton={
              meet.id !== meeting.connectedMeetings.parentMeeting.id ? (
                <Button
                  className="m-2 border-1"
                  size="sm"
                  variant="ghost"
                  onClick={() => joinRoom(meet.id || '')}>
                  Join {meet.title}
                </Button>
              ) : undefined
            }
          />
        ))}
      </div>
      <div className="my-4">
        <EndBreakoutButton />
      </div>
    </div>
  )
}
