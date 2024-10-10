/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useRef } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
// eslint-disable-next-line import/order
import { Button, Card } from '@nextui-org/react'

// eslint-disable-next-line import/no-cycle
import { DragDropContext } from 'react-beautiful-dnd'

import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { BreakoutRoomsWithParticipants } from './BreakoutRoomsFrame'
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import { RenderIf } from '../RenderIf/RenderIf'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useDimensions } from '@/hooks/useDimensions'
import { useStoreSelector } from '@/hooks/useRedux'
import { IFrame } from '@/types/frame.type'
// eslint-disable-next-line import/no-cycle

export type BreakoutFrame = IFrame & {
  content: {
    title: string
    description: string
    breakoutType: string
    countOfRoomsGroups: number
  }
}

interface BreakoutProps {
  frame: BreakoutFrame
  isEditable?: boolean
}

export function BreakoutFrameLive({
  frame,
  isEditable = false,
}: BreakoutProps) {
  const { isOwner, preview, currentFrame, getFrameById, setCurrentFrame } =
    useEventContext()
  const { isHost } = useEventSession()
  const { meeting } = useDyteMeeting()
  const { isBreakoutActive } = useBreakoutRooms()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const breakoutFrameId = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId
  )

  const editable = isOwner && !preview && isEditable

  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )

  return (
    <div>
      <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.ROOMS}>
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
            {frame.content?.breakoutRooms?.map((breakout, idx) => (
              <BreakoutRoomActivityCard
                idx={idx}
                editable={false}
                breakout={breakout}
                participants={
                  isHost &&
                  isBreakoutActive &&
                  breakoutFrameId === currentFrame?.id
                    ? meeting.connectedMeetings.meetings?.[idx]?.participants
                    : undefined
                }
                roomId={meeting.connectedMeetings.meetings?.[idx]?.id}
                JoinRoomButton={
                  isHost &&
                  !isInBreakoutMeeting &&
                  breakoutFrameId === currentFrame?.id &&
                  meeting.connectedMeetings.meetings?.[idx] &&
                  meeting.connectedMeetings.meetings?.[idx].id !==
                    meeting.connectedMeetings.currentMeetingId ? (
                    <Button
                      className="m-2 border-1"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        breakoutRoomsInstance?.joinRoom(
                          meeting.connectedMeetings.meetings?.[idx]?.id || ''
                        )
                      }>
                      Join {meeting.connectedMeetings.meetings?.[idx].title}
                    </Button>
                  ) : undefined
                }
              />
            ))}
          </DragDropContext>
        </div>
      </RenderIf>
      <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.GROUPS}>
        {breakoutFrameId !== currentFrame?.id ? (
          <Card key="breakout-group-activity" className="border p-4 w-[65%]">
            <div className="flex justify-between gap-4">
              <span className="text-md font-semibold">Activity</span>
            </div>
            <div className="border border-dashed border-gray-200 text-gray-400 mt-4 h-96 flex items-center justify-center">
              <RenderIf isTrue={Boolean(frame?.content?.groupActivityId)}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                  ref={thumbnailContainerRef}
                  className="relative w-full h-full"
                  onClick={() => {
                    if (!editable) return
                    setCurrentFrame(
                      getFrameById(frame?.content?.groupActivityId as string)
                    )
                  }}>
                  <FrameThumbnailCard
                    frame={getFrameById(
                      frame?.content?.groupActivityId as string
                    )}
                    containerWidth={containerWidth}
                    inViewPort
                  />
                </div>
              </RenderIf>
            </div>
          </Card>
        ) : (
          <BreakoutRoomsWithParticipants />
        )}
      </RenderIf>
    </div>
  )
}
