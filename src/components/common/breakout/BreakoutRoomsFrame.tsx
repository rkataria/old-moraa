/* eslint-disable jsx-a11y/control-has-associated-label */

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { Button } from '@nextui-org/react'
import { DragDropContext } from 'react-beautiful-dnd'

import { BreakoutRoomActivityCard } from './BreakoutActivityCard'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'

export function BreakoutRoomsWithParticipants({
  hideActivityCards,
  smartBreakoutActivityId,
}: {
  hideActivityCards?: boolean
  smartBreakoutActivityId?: string
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
  const smartBreakoutActivity = getFrameById(smartBreakoutActivityId!)

  return (
    <div className="w-full flex-1">
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3 overflow-y-auto">
        <DragDropContext
          onDragEnd={(result) => {
            const participantId = result.draggableId.split('_')[1] as string
            const destinationRoomId = result.destination?.droppableId.split(
              '_'
            )[1] as string

            breakoutRoomsInstance?.moveParticipantToAnotherRoom(
              participantId,
              destinationRoomId
            )
          }}>
          {meeting.connectedMeetings.meetings.map((meet, index) => (
            <BreakoutRoomActivityCard
              idx={index}
              breakout={{
                activityId:
                  breakoutFrame?.content?.activityId ||
                  breakoutFrame?.content?.groupActivityId ||
                  smartBreakoutActivityId,
                name: breakoutFrame?.content?.groupActivityId
                  ? ''
                  : smartBreakoutActivity?.content?.title,
              }}
              editable={false}
              roomId={meet.id}
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
                    Join Room {index + 1}
                  </Button>
                ) : undefined
              }
            />
          ))}
        </DragDropContext>
      </div>
    </div>
  )
}
