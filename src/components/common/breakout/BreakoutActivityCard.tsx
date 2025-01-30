/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef } from 'react'

import { Avatar } from '@nextui-org/react'
import { IconTrash } from '@tabler/icons-react'
import { Draggable } from 'react-beautiful-dnd'
import { IoEllipsisVerticalOutline } from 'react-icons/io5'
import { TbApps, TbTriangleSquareCircleFilled } from 'react-icons/tb'
import { TiDocumentDelete } from 'react-icons/ti'

// TODO: Fix this.
// eslint-disable-next-line import/no-cycle
import { BreakoutFrameThumbnailCard } from './BreakoutFrameThumbnailCard'
import { DropdownActions } from '../DropdownActions'
import { EditableLabel } from '../EditableLabel'
import { RenderIf } from '../RenderIf/RenderIf'
import { Tooltip } from '../ShortuctTooltip'
import { StrictModeDroppable } from '../StrictModeDroppable'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { cn } from '@/utils/utils'

type BreakoutRoomActivityCardProps = {
  breakout: any
  idx: number
  hideActivityCard?: boolean
  participants?: {
    id?: string
    displayName?: string
    displayPictureUrl?: string
    customParticipantId?: string
  }[]
  editable: boolean
  deleteActivityFrame?: (idx: number) => void
  updateBreakoutRoomName?: (value: string, idx: number) => void
  deleteRoomGroup?: (idx: number) => void
  onAddNewActivity?: (index: number) => void
  hideRoomDelete?: boolean
  JoinRoomButton?: React.ReactElement
  roomId?: string
}

export const roomActions = [
  {
    key: 'delete-room',
    label: 'Delete room',
    icon: <IconTrash className="text-slate-500" size={20} />,
  },
  {
    key: 'add-activity',
    label: 'Add activity in room',
    icon: <TbApps className="text-slate-500" size={20} />,
  },
  {
    key: 'delete-room-activity',
    label: 'Remove activity from room',
    icon: <TiDocumentDelete className="text-slate-500" size={20} />,
  },
]

export function BreakoutRoomActivityCard({
  breakout,
  editable,
  idx,
  hideActivityCard = false,
  updateBreakoutRoomName,
  deleteRoomGroup,
  deleteActivityFrame,
  onAddNewActivity,
  hideRoomDelete,
  participants,
  JoinRoomButton,
  roomId,
}: BreakoutRoomActivityCardProps) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )
  const { setCurrentFrame, getFrameById, isOwner } = useEventContext()

  const getActions = () => {
    const actions = []

    if (!hideRoomDelete) {
      actions.push(roomActions[0])
    }

    if (breakout?.activityId) {
      actions.push(roomActions[2])
    }
    if (!breakout?.activityId) {
      actions.push(roomActions[1])
    }

    return actions
  }

  return (
    <div className="border rounded-xl bg-white relative" key={breakout?.name}>
      <div className="flex justify-between items-center gap-4 px-3">
        <EditableLabel
          readOnly={!editable || !updateBreakoutRoomName}
          label={breakout?.name || ''}
          className="text-sm line-clamp-1 my-2"
          onUpdate={(value) => {
            if (!editable) return
            // if (frame.content.breakout === value) return

            updateBreakoutRoomName?.(value, idx)
          }}
        />
        <RenderIf isTrue={editable}>
          <DropdownActions
            triggerIcon={
              <Button isIconOnly variant="light" className="-mr-2.5">
                <IoEllipsisVerticalOutline size={20} />
              </Button>
            }
            actions={getActions()}
            onAction={(actionKey) => {
              if (actionKey === 'delete-room') {
                deleteRoomGroup?.(idx)
              }

              if (actionKey === 'delete-room-activity') {
                deleteActivityFrame?.(idx)
              }

              if (actionKey === 'add-activity') {
                onAddNewActivity?.(idx)
              }
            }}
          />
        </RenderIf>
      </div>
      <RenderIf isTrue={!hideActivityCard}>
        <div
          className={cn(
            'border border-gray-100 text-gray-400 m-1 bg-[#f9f6ff] rounded-xl aspect-video'
          )}>
          <RenderIf
            isTrue={breakout?.activityId && getFrameById(breakout?.activityId)}>
            <div
              ref={thumbnailContainerRef}
              className="relative w-full h-full cursor-pointer"
              onClick={() => {
                if (!editable) return
                setCurrentFrame(getFrameById(breakout?.activityId))
              }}>
              <BreakoutFrameThumbnailCard
                frame={getFrameById(breakout?.activityId)}
                containerWidth={containerWidth}
                inViewPort
              />
            </div>
          </RenderIf>
          <RenderIf isTrue={!breakout?.activityId}>
            <div
              className="grid place-items-center h-full w-full cursor-pointer aspect-video"
              onClick={() => {
                if (!editable) return
                onAddNewActivity?.(idx)
              }}>
              <div
                className={cn('grid place-items-center gap-4', {
                  'gap-2': !editable,
                })}>
                <TbTriangleSquareCircleFilled
                  size={48}
                  className={cn({
                    'text-primary-300': editable,
                    'text-gray-300': !editable,
                  })}
                />

                <p className="text-xs text-center">
                  {editable ? (
                    <>
                      Click to select a collaborative
                      <br />
                      activity!
                    </>
                  ) : (
                    'No activity!'
                  )}
                </p>
              </div>
            </div>
          </RenderIf>
        </div>
      </RenderIf>
      {!!participants && (
        <StrictModeDroppable
          droppableId={`participant-droppable_${roomId}`}
          direction="horizontal"
          type="participant">
          {(participantDroppableProvided, snapshot) => (
            <div
              key={`participant-draggable_${roomId}`}
              ref={participantDroppableProvided.innerRef}
              className={cn(
                'flex items-center m-2 px-2 pt-2 relative rounded-md transition-all border-2 border-transparent',
                {
                  'border-2 border-gray-600 animate-pulse':
                    snapshot.isDraggingOver,
                  'border-2 border-gray-400': snapshot.draggingFromThisWith,
                }
              )}
              {...participantDroppableProvided.droppableProps}>
              {participants?.length === 0 ? (
                <p className="text-sm text-gray-400">No participants</p>
              ) : null}

              {participants?.map((participant, index) => (
                <Draggable
                  key={`participant-draggable_${participant.customParticipantId}`}
                  index={index}
                  isDragDisabled={!isOwner}
                  draggableId={`participant-draggable_${participant.customParticipantId}`}>
                  {(sectionDraggableProvided) => (
                    <div
                      className="mb-2 items-center mr-2"
                      ref={sectionDraggableProvided.innerRef}
                      {...sectionDraggableProvided.draggableProps}
                      {...sectionDraggableProvided.dragHandleProps}>
                      <Tooltip content={participant?.displayName || ''}>
                        <Avatar
                          src={participant?.displayPictureUrl}
                          name={participant?.displayName}
                          showFallback
                        />
                      </Tooltip>
                    </div>
                  )}
                </Draggable>
              ))}
              <div className="inline-flex">
                {participantDroppableProvided.placeholder}
              </div>
            </div>
          )}
        </StrictModeDroppable>
      )}
      <RenderIf isTrue={!!JoinRoomButton}>
        <div className="h-10" />
        <div className="absolute bottom-0 right-0 left-0 mt-10">
          {JoinRoomButton}
        </div>
      </RenderIf>
    </div>
  )
}
