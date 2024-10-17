/* eslint-disable jsx-a11y/control-has-associated-label */

import { useMemo } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
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
  const connectedMeetings = useDyteSelector((dyte) => dyte.connectedMeetings)
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

  const sortedBreakoutMeetings = useMemo(
    () =>
      connectedMeetings.meetings.sort((a, b) => {
        const nameA = a.title?.toUpperCase() || 0
        const nameB = b.title?.toUpperCase() || 0
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        // names must be equal
        return 0
      }),
    [connectedMeetings.meetings]
  )

  const breakoutRooms = useMemo(
    () =>
      [...(breakoutFrame?.content?.breakoutRooms || [])]?.sort((a, b) => {
        const nameA = a.name?.toUpperCase() || 0
        const nameB = b.name?.toUpperCase() || 0
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        // names must be equal
        return 0
      }),
    [breakoutFrame?.content?.breakoutRooms]
  )

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
          <BreakoutRoomActivityCard
            editable={false}
            breakout={{
              name: 'Main Room',
            }}
            roomId={
              connectedMeetings.parentMeeting?.id || meeting.meta.meetingId
            }
            idx={1000}
            hideActivityCard
            participants={connectedMeetings.parentMeeting.participants?.map(
              (p) => ({
                displayName: p?.displayName || '',
                id: p?.id || '',
                displayPictureUrl: p?.displayPictureUrl || '',
              })
            )}
          />
          {sortedBreakoutMeetings.map((meet, index) => (
            <BreakoutRoomActivityCard
              idx={index}
              breakout={{
                activityId:
                  breakoutRooms?.[index]?.activityId ||
                  breakoutFrame?.content?.groupActivityId ||
                  smartBreakoutActivityId,
                name:
                  breakoutRooms?.[index]?.name ||
                  getFrameById(breakoutFrame?.content?.groupActivityId || '')
                    ?.content?.title ||
                  smartBreakoutActivity?.content?.title,
                meetingName: meet.title,
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
                meet.id !== connectedMeetings.parentMeeting.id ? (
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
