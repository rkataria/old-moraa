/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { DyteConnectedMeetings } from '@dytesdk/web-core'
import { Button } from '@nextui-org/react'
import { DragDropContext } from 'react-beautiful-dnd'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { RenderIf } from '../RenderIf/RenderIf'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreSelector } from '@/hooks/useRedux'

export function BreakoutRoomsWithParticipants({
  hideActivityCards,
}: {
  hideActivityCards?: boolean
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCount] = useState(0)
  const { getFrameById } = useEventContext()
  const { isHost } = useEventSession()
  const meeting = useDyteSelector((meet) => meet)
  const mainMeetingId = meeting.meta.meetingId
  const connectedMeetings = meeting.connectedMeetings?.meetings || []
  const mainMeetingParticipants =
    meeting.connectedMeetings?.parentMeeting?.participants || []
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const { isBreakoutActive } = useBreakoutRooms()
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
  const meetingTitles = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.meetingTitles
  )

  useEffect(() => {
    if (!isBreakoutActive) return () => null

    const interval = setInterval(() => setCount((count) => count + 1), 2000)

    return () => clearInterval(interval)
  }, [isBreakoutActive])

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
                name: meetingTitles?.find((m) => m.id === meet.id)?.title,
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
                <RenderIf
                  isTrue={
                    meet.id !== mainMeetingId &&
                    (isHost ||
                      breakoutFrame.config.assignmentOption === 'choose')
                  }>
                  <Button
                    className="m-2 border-1"
                    size="sm"
                    variant="ghost"
                    onClick={() => joinRoom(meet.id || '')}>
                    Join Room {index + 1}
                  </Button>
                </RenderIf>
              }
            />
          ))}
        </DragDropContext>
      </div>
    </div>
  )
}
