/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

// eslint-disable-next-line import/order

// eslint-disable-next-line import/no-cycle
import { DragDropContext } from 'react-beautiful-dnd'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { BreakoutRoomsWithParticipants } from './BreakoutRoomsWithParticipants'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import { FrameTitleDescriptionPreview } from '../FrameTitleDescriptionPreview'
import { RenderIf } from '../RenderIf/RenderIf'

import { useBreakoutActivities } from '@/hooks/useBreakoutActivities'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
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
}

export function BreakoutFrameLive({ frame }: BreakoutProps) {
  const { isBreakoutActive } = useBreakoutRooms()
  const isCurrentFrameBreakoutFrame = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId === state.event.currentEvent.eventState.currentFrameId
  )
  const breakoutActivityQuery = useBreakoutActivities({ frameId: frame.id })

  const isBreakoutActiveOnCurrentFrame =
    isBreakoutActive && isCurrentFrameBreakoutFrame

  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} />
      <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.ROOMS}>
        {!isBreakoutActiveOnCurrentFrame ? (
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3 overflow-y-auto">
            <DragDropContext onDragEnd={() => {}}>
              {breakoutActivityQuery.data?.map((breakout) => (
                <BreakoutRoomActivityCard
                  key={breakout.id}
                  editable={false}
                  breakout={breakout}
                />
              ))}
            </DragDropContext>
          </div>
        ) : (
          <div className="overflow-y-auto">
            <BreakoutRoomsWithParticipants />
          </div>
        )}
      </RenderIf>
      <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.GROUPS}>
        {!isBreakoutActiveOnCurrentFrame ? (
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3 overflow-y-auto">
            <DragDropContext onDragEnd={() => {}}>
              <BreakoutRoomActivityCard
                key={frame.id}
                editable={false}
                breakout={{
                  name: 'Group Activity',
                  activity_frame_id:
                    breakoutActivityQuery.data?.[0]?.activity_frame_id ?? '',
                  id: '',
                }}
              />
            </DragDropContext>
          </div>
        ) : (
          <div className="overflow-y-auto">
            <BreakoutRoomsWithParticipants />
          </div>
        )}
      </RenderIf>
    </>
  )
}
