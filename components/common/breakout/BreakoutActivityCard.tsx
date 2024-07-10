/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef } from 'react'

import { DragDropContext } from 'react-beautiful-dnd'
import { IoAddSharp } from 'react-icons/io5'

import { Tooltip } from '@nextui-org/react'

// TODO: Fix this.
// eslint-disable-next-line import/no-cycle
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { EditableLabel } from '../EditableLabel'
import { RenderIf } from '../RenderIf/RenderIf'
import { StrictModeDroppable } from '../StrictModeDroppable'

import { useEventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { cn } from '@/utils/utils'

type BreakoutCardProps = {
  breakout: any
  idx: number
  hideActivityCard?: boolean
  participants?: {
    id?: string
    displayName?: string
    displayPictureUrl?: string
  }[]
  editable: boolean
  addFrameToRoom?: (result: any) => void
} & (
  | {
      editable: boolean
      updateBreakoutGroupRoomNameName: (value: string, idx: number) => void
      deleteRoomGroup: (idx: number) => void
      onAddNewActivity: (index: number) => void
    }
  | {
      editable: false
      updateBreakoutGroupRoomNameName?: never
      deleteRoomGroup?: never
      onAddNewActivity?: never
    }
)

export function BreakoutActivityCard({
  breakout,
  editable,
  idx,
  hideActivityCard = false,
  updateBreakoutGroupRoomNameName,
  deleteRoomGroup,
  onAddNewActivity,
  addFrameToRoom,
  participants,
}: BreakoutCardProps) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )
  const { setCurrentFrame, getCurrentFrame } = useEventContext()

  return (
    <div
      className={cn('border rounded p-2', {
        // 'min-h-[120px]': !hideActivityCard,
      })}
      key={breakout?.name}>
      <div className="flex justify-between gap-4">
        <EditableLabel
          readOnly={!editable}
          label={breakout?.name || ''}
          className="text-sm"
          onUpdate={(value) => {
            if (!editable) return
            // if (frame.content.breakout === value) return

            updateBreakoutGroupRoomNameName(value, idx)
          }}
        />
        <RenderIf isTrue={editable}>
          <span className="flex gap-2">
            <IoAddSharp
              className="border border-dashed border-gray-400 text-gray-400"
              onClick={() => {
                if (!editable) return
                onAddNewActivity(idx)
              }}
            />
            <RenderIf isTrue={breakout?.activityId}>
              <IoAddSharp
                className="rotate-45"
                onClick={() => {
                  if (!editable) return
                  deleteRoomGroup(idx)
                }}
              />
            </RenderIf>
          </span>
        </RenderIf>
      </div>
      <RenderIf isTrue={!hideActivityCard}>
        <div className="border border-dashed border-gray-200 text-gray-400 mt-4 h-40 min-w-48 p-2">
          {breakout?.activityId ? (
            <div
              ref={thumbnailContainerRef}
              className="relative w-full h-full"
              onClick={() => {
                if (!editable) return
                setCurrentFrame(getCurrentFrame(breakout?.activityId))
              }}>
              <FrameThumbnailCard
                frame={getCurrentFrame(breakout?.activityId)}
                containerWidth={containerWidth}
              />
            </div>
          ) : (
            <DragDropContext
              onDragEnd={(result) => {
                addFrameToRoom?.(result)
              }}>
              <StrictModeDroppable
                droppableId={`breakout-frame-droppable-${breakout?.name}`}
                type="breakout-frame">
                {(sectionDroppableProvided) => (
                  <div
                    onClick={() => {
                      if (!editable) return
                      onAddNewActivity(idx)
                    }}
                    className="text-clip h-full"
                    ref={sectionDroppableProvided.innerRef}
                    {...sectionDroppableProvided.droppableProps}>
                    You can add existing slide from any section or add new slide
                    which will be added under the Breakout section
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          )}
        </div>
      </RenderIf>
      {!!participants && (
        <div className="flex items-center mt-2">
          {participants?.length === 0 ? (
            <p className="text-sm text-gray-400">No participants</p>
          ) : null}
          {participants?.map((participant) => (
            <div className="mb-2 mr-2">
              <Tooltip content={participant.displayName}>
                {participant.displayPictureUrl ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={participant.displayPictureUrl}
                    alt={participant.id}
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">
                    <p className="text-sm">
                      {participant.displayName?.split(' ')[0]?.[0]}
                      {participant.displayName?.split(' ')[1]?.[0]}
                    </p>
                  </div>
                )}
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
