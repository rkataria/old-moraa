/* eslint-disable jsx-a11y/control-has-associated-label */

import { useDyteSelector } from '@dytesdk/react-web-core'
import { DyteConnectedMeetings } from '@dytesdk/web-core'
import { Button } from '@nextui-org/react'
import { DragDropContext } from 'react-beautiful-dnd'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'

export function BreakoutRoomsWithParticipants({
  hideActivityCards,
}: {
  hideActivityCards?: boolean
}) {
  const { getFrameById } = useEventContext()
  const meeting = useDyteSelector((meet) => meet)
  const mainMeetingId = meeting.meta.meetingId
  const connectedMeetings = meeting.connectedMeetings?.meetings || []
  const mainMeetingParticipants =
    meeting.connectedMeetings?.parentMeeting?.participants || []
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const breakoutFrameId = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId
  )
  const connectedMeetingsToActivitiesMap = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.connectedMeetingsToActivitiesMap
  )
  const joinRoom = (meetId: string) => {
    breakoutRoomsInstance?.joinRoom(meetId)
  }

  const breakoutFrame = getFrameById(breakoutFrameId!)

  const breakoutRooms = breakoutFrame?.content?.breakoutRooms || [
    {
      activityId: breakoutFrame.content?.groupActivityId,
      name: 'Group Activity',
    },
  ]

  const meetingsAndActivityList = Object.entries(
    connectedMeetingsToActivitiesMap || {}
  )

  const sortedConnectedMeetings = breakoutFrame.content?.groupActivityId
    ? connectedMeetings.sort((a, b) => a.id!.localeCompare(b.id!))
    : breakoutRooms
        .map(
          (room) =>
            connectedMeetings.find((meet) =>
              meetingsAndActivityList.find(
                ([meetId, activityId]) =>
                  room?.activityId === activityId && meet.id === meetId
              )
            ) as DyteConnectedMeetings['meetings'][number]
        )
        .filter(Boolean)

  return (
    <div className="w-full flex-1">
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3 overflow-y-auto">
        <DragDropContext
          onDragEnd={(result) => {
            const participantId = result.draggableId.split('_')[1] as string
            const destinationRoomId = result.destination?.droppableId.split(
              '_'
            )[1] as string
            const allMeetings = [
              ...meeting.connectedMeetings.meetings,
              meeting.connectedMeetings.parentMeeting,
            ]

            const sourceMeeting = allMeetings.find((meet) =>
              meet.participants.some(
                (participant) =>
                  participant.customParticipantId === participantId
              )
            )
            if (sourceMeeting?.id === destinationRoomId) return

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
            roomId={mainMeetingId}
            idx={1000}
            hideActivityCard
            participants={mainMeetingParticipants}
          />
          {sortedConnectedMeetings.map((meet, index) => (
            <BreakoutRoomActivityCard
              key={meet.id}
              idx={index}
              breakout={{
                activityId:
                  connectedMeetingsToActivitiesMap?.[meet.id as string],
                name:
                  breakoutRooms.find(
                    (room) =>
                      room.activityId ===
                      connectedMeetingsToActivitiesMap?.[meet.id as string]
                  )?.name ||
                  getFrameById(breakoutFrame?.content?.groupActivityId || '')
                    ?.content?.title,
                meetingName: meet.title,
              }}
              editable={false}
              roomId={meet.id}
              hideActivityCard={hideActivityCards}
              participants={meet.participants?.map((p) => ({
                displayName: p?.displayName || '',
                customParticipantId: p?.customParticipantId || '',
                displayPictureUrl: p?.displayPictureUrl || '',
              }))}
              JoinRoomButton={
                meet.id !== mainMeetingId ? (
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
