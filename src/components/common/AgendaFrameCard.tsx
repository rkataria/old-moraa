/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useRef, useState } from 'react'

import { Tooltip } from '@nextui-org/react'
import { IconDots } from '@tabler/icons-react'

import { ContentTypeIcon } from './ContentTypeIcon'
import { getContentType } from './ContentTypePicker'
import { DeleteFrameModal } from './DeleteFrameModal'
import { EditableLabel } from './EditableLabel'
import { FrameActions } from './FrameActions'
import { FramePreview } from './FramePreview'

import type {
  EventContextType,
  EventModeType,
} from '@/types/event-context.type'

import { EventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { type AgendaFrameDisplayType } from '@/types/event.type'
import { type IFrame } from '@/types/frame.type'
import { isFrameThumbnailAvailable } from '@/utils/content.util'
import { getFrameName } from '@/utils/getFrameName'
import { cn } from '@/utils/utils'

interface FrameListViewProps {
  frame: IFrame
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draggableProps: any
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions: any
  isDragging: boolean
  isDeleteModalOpen: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIsDeleteModalOpen: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDelete: any
  onChangeFrame: () => void
}

interface FrameThumbnailViewProps {
  frame: IFrame
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draggableProps: any
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions: any
  isDeleteModalOpen: boolean
  isDragging: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIsDeleteModalOpen: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDelete: any
  onChangeFrame: () => void
}

export type AgendaFrameCardProps = {
  frame: IFrame
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draggableProps: any
  displayType: AgendaFrameDisplayType
  isDragging: boolean
}

type IsDraggableArgs = {
  eventMode: EventModeType
  isOwner: boolean
}

const isDraggable = ({ eventMode, isOwner }: IsDraggableArgs) => {
  if (eventMode === 'present' && isOwner) return true

  if (eventMode === 'edit') return true

  return false
}

function FrameListView({
  frame,
  draggableProps,
  index,
  handleActions,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDelete,
  onChangeFrame,
}: FrameListViewProps) {
  const { preview, eventMode, updateFrame, currentFrame, isOwner } = useContext(
    EventContext
  ) as EventContextType

  return (
    <div
      className={cn(
        'relative group border-2 border-transparent rounded-sm hover:border-gray-300',
        {
          'bg-gray-200': currentFrame?.id === frame.id,
        }
      )}>
      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-500 group-hover:opacity-100 flex-none w-5 h-5 text-xs bg-gray-800 text-white rounded-full flex justify-center items-center">
        {index + 1}
      </div>
      <div
        data-miniframe-id={frame.id}
        key={`mini-frame-${frame.id}`}
        className={cn(
          'flex justify-start items-center gap-2 px-[4px] py-[6px] pl-18 max-w-full',
          {
            'cursor-grab': isOwner && eventMode === 'edit' && !preview,
            'cursor-pointer': (isOwner && eventMode === 'present') || preview,
          }
        )}>
        <div
          {...(isDraggable({ eventMode, isOwner }) && draggableProps)}
          className={cn(
            'rounded-md flex-auto w-full transition-all flex items-center justify-between gap-2 group px-2',
            {
              'cursor-grab': isOwner && eventMode === 'edit' && !preview,
              'drop-shadow-sm rounded-[2px]': currentFrame?.id === frame.id,
              'drop-shadow-none': currentFrame?.id !== frame.id,
            }
          )}>
          <ContentTypeIcon frameType={frame.type} />
          <div className={cn('shrink w-full')} onClick={onChangeFrame}>
            <EditableLabel
              readOnly={!isOwner || eventMode !== 'edit'}
              label={getFrameName({ frame })}
              className="text-sm"
              onUpdate={(value) => {
                if (frame.name === value) return

                updateFrame({
                  framePayload: { name: value },
                  frameId: frame.id,
                })
              }}
            />
          </div>
          {isOwner && eventMode === 'edit' && (
            <FrameActions
              triggerIcon={
                <div className="cursor-pointer h-full w-fit bg-black/10 rounded hidden group-hover:block">
                  <IconDots className="h-5 w-5 text-white px-1" />
                </div>
              }
              handleActions={(action) => handleActions(action, frame)}
            />
          )}
        </div>
        <DeleteFrameModal
          isModalOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          handleDelete={handleDelete}
          frame={frame}
        />
      </div>
    </div>
  )
}

function FrameThumbnailView({
  frame,
  draggableProps,
  index,
  handleActions,
  isDeleteModalOpen,
  isDragging,
  setIsDeleteModalOpen,
  handleDelete,
  onChangeFrame,
}: FrameThumbnailViewProps) {
  const { preview, eventMode, updateFrame, currentFrame, isOwner } = useContext(
    EventContext
  ) as EventContextType

  const myRef = useRef(null)

  const actionDisabled = eventMode !== 'edit' || !isOwner || preview
  const contentType = getContentType(frame.type)

  const renderFrameThumbnail = () => {
    if (isFrameThumbnailAvailable(frame.type)) {
      return (
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-md z-0"
          style={{
            width: `${window.screen.width}px`,
            height: `${window.screen.height}px`,
            transformOrigin: 'left top',
            scale: `${(1 / window.screen.width) * cardWidth}`,
          }}>
          <FramePreview frame={frame} key={JSON.stringify(frame.content)} />
        </div>
      )
    }

    return null
  }

  const { width: cardWidth } = useDimensions(myRef)

  return (
    <div
      ref={myRef}
      data-miniframe-id={frame.id}
      key={`mini-frame-${frame.id}`}
      className={cn(
        'flex justify-start items-center gap-2 w-full bg-white border-1 rounded-md overflow-hidden ',
        {
          'cursor-grab': isOwner && eventMode === 'edit' && !preview,
          'cursor-pointer': isOwner && eventMode === 'present' && !preview,
          'drop-shadow-md border-2 border-black': currentFrame?.id === frame.id,
          'drop-shadow-none border-slate-200': currentFrame?.id !== frame.id,
          'group/card': eventMode === 'edit',
        }
      )}
      {...(isDraggable({ eventMode, isOwner }) && draggableProps)}>
      <div className="w-full" onClick={onChangeFrame}>
        <div
          className={cn(
            'relative w-full aspect-video transition-all group overflow-hidden',

            isDragging && '!bg-primary/20'
          )}>
          {renderFrameThumbnail()}
          <div className="flex justify-end bg-[rgba(0,0,0,0.6)] absolute w-full h-full group-hover/card:opacity-100 opacity-0 duration-300" />

          <div className="flex-none absolute left-2 top-2 w-5 h-5 text-xs bg-black/20 text-white rounded-full flex justify-center items-center group-hover/card:hidden">
            {index + 1}
          </div>
          {contentType && (
            <div className="flex-none absolute right-2 top-2 p-1 bg-black/20 rounded-full flex justify-center items-center group-hover/card:hidden">
              <Tooltip content={contentType.name}>
                <div className={cn('text-white flex-none w-3 h-3')}>
                  {contentType.icon}
                </div>
              </Tooltip>
            </div>
          )}
        </div>
        <div className="p-2 bg-white flex items-center justify-between w-full">
          <div className="shrink w-full">
            <EditableLabel
              readOnly={actionDisabled}
              label={getFrameName({ frame })}
              className="text-sm"
              onUpdate={(value) => {
                if (frame.name === value) return

                updateFrame({
                  framePayload: { name: value },
                  frameId: frame.id,
                })
              }}
            />
          </div>
          {!preview && isOwner && eventMode === 'edit' && (
            <FrameActions
              triggerIcon={
                <div className="cursor-pointer h-fit w-fit bg-black/20 rounded group-hover/card:opacity-100 opacity-0">
                  <IconDots className="text-lg text-white px-1" />
                </div>
              }
              handleActions={(action) => handleActions(action, frame)}
            />
          )}
        </div>
      </div>

      <DeleteFrameModal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        handleDelete={handleDelete}
        frame={frame}
      />
    </div>
  )
}

type FrameActionKey = 'delete' | 'move-up' | 'move-down'

export function AgendaFrameCard({
  frame,
  index,
  draggableProps,
  displayType,
  isDragging,
}: AgendaFrameCardProps) {
  const {
    deleteFrame,
    moveUpFrame,
    moveDownFrame,
    setCurrentFrame,
    setSelectedSectionId,
    eventMode,
    isOwner,
  } = useContext(EventContext) as EventContextType

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const handleActions = (
    action: { key: FrameActionKey; label: string },
    actionFrame: IFrame
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: Record<FrameActionKey, any> = {
      delete: () => setIsDeleteModalOpen(true),
      'move-up': () => moveUpFrame(actionFrame),
      'move-down': () => moveDownFrame(actionFrame),
    }

    actions[action.key]()
  }

  const handleDelete = (_frame: IFrame) => {
    deleteFrame(_frame)
    setIsDeleteModalOpen(false)
  }

  const handleChangeFrame = (s: IFrame) => {
    if (!['edit', 'view'].includes(eventMode) && !isOwner) {
      return
    }

    setCurrentFrame(s)
    setSelectedSectionId?.(null)
  }

  if (displayType === 'thumbnail') {
    return (
      <FrameThumbnailView
        key={frame.id}
        frame={frame}
        draggableProps={draggableProps}
        index={index}
        handleActions={handleActions}
        isDeleteModalOpen={isDeleteModalOpen}
        isDragging={isDragging}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDelete={handleDelete}
        onChangeFrame={() => handleChangeFrame(frame)}
      />
    )
  }

  return (
    <FrameListView
      frame={frame}
      draggableProps={draggableProps}
      index={index}
      handleActions={handleActions}
      isDeleteModalOpen={isDeleteModalOpen}
      isDragging={isDragging}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      handleDelete={handleDelete}
      onChangeFrame={() => handleChangeFrame(frame)}
    />
  )
}
