/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useState } from 'react'

import { IconDots } from '@tabler/icons-react'

import { Tooltip } from '@nextui-org/react'

import { DeleteSlideModal } from './DeleteSlideModal'
import { EditableLabel } from './EditableLabel'
import { SlideActions } from './SlideActions'

import type {
  EventContextType,
  EventModeType,
} from '@/types/event-context.type'

import { contentTypes } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { type AgendaSlideDisplayType } from '@/types/event.type'
import { type ISlide } from '@/types/slide.type'
import { cn } from '@/utils/utils'

interface SlideListViewProps {
  slide: ISlide
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
  onChangeSlide: () => void
}

interface SlideThumbnailViewProps {
  slide: ISlide
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
  onChangeSlide: () => void
}

export type AgendaSlideCardProps = {
  slide: ISlide
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draggableProps: any
  displayType: AgendaSlideDisplayType
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

function SlideListView({
  slide,
  draggableProps,
  index,
  handleActions,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDelete,
  onChangeSlide,
}: SlideListViewProps) {
  const { eventMode, updateSlide, currentSlide, isOwner } = useContext(
    EventContext
  ) as EventContextType

  const Icon = contentTypes.find(
    (type) => type.contentType === slide.type
  )?.icon

  return (
    <div
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className={cn('flex justify-start items-center gap-2 px-2 max-w-full', {
        'cursor-grab': isOwner && eventMode === 'edit',
      })}>
      <div className="flex-none w-5 h-5 text-xs bg-black/20 text-white rounded-full flex justify-center items-center">
        {index + 1}
      </div>
      <Tooltip content={slide.type}>
        <div className="text-slate-400 flex-none w-5 h-5">{Icon}</div>
      </Tooltip>
      <div
        {...(isDraggable({ eventMode, isOwner }) && draggableProps)}
        className={cn(
          'rounded-md flex-auto w-full transition-all flex items-center justify-between gap-2 group pl-2',
          currentSlide?.id === slide.id
            ? 'drop-shadow-sm rounded-[2px]'
            : 'drop-shadow-none'
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || '#FFFFFF',
        }}>
        <div
          className={cn('shrink w-full', {
            'cursor-text': isOwner && eventMode === 'edit',
          })}
          onClick={onChangeSlide}>
          <EditableLabel
            readOnly={!isOwner || eventMode !== 'edit'}
            label={slide.name}
            onUpdate={(value) => {
              updateSlide({ ...slide, name: value })
            }}
          />
        </div>
        {isOwner && eventMode === 'edit' && (
          <SlideActions
            triggerIcon={
              <div className="h-full w-fit bg-slate-100 rounded hidden group-hover:block">
                <IconDots className="h-6 w-6 text-slate-500 px-1" />
              </div>
            }
            handleActions={(action) => handleActions(action, slide)}
          />
        )}
      </div>
      <DeleteSlideModal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        handleDelete={handleDelete}
        slide={slide}
      />
    </div>
  )
}

function SlideThumbnailView({
  slide,
  draggableProps,
  index,
  handleActions,
  isDeleteModalOpen,
  isDragging,
  setIsDeleteModalOpen,
  handleDelete,
  onChangeSlide,
}: SlideThumbnailViewProps) {
  const { preview, eventMode, updateSlide, currentSlide, isOwner } = useContext(
    EventContext
  ) as EventContextType

  return (
    <div
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className="flex justify-start items-center gap-2 w-full bg-white"
      {...(isDraggable({ eventMode, isOwner }) && draggableProps)}>
      <div
        onClick={onChangeSlide}
        className={cn(
          'relative rounded-md w-full aspect-video cursor-pointer transition-all border-2 group',
          currentSlide?.id === slide.id
            ? 'drop-shadow-md border-black'
            : 'drop-shadow-none border-black/20',
          isDragging && '!bg-primary/20'
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || '#FFFFFF',
        }}>
        <div className="flex-none absolute left-2 top-2 w-5 h-5 text-xs bg-black/20 text-white rounded-full flex justify-center items-center">
          {index + 1}
        </div>
        <div className="absolute left-0 px-2 bottom-1 flex items-center justify-between w-full">
          <div className="shrink w-full cursor-pointer">
            <EditableLabel
              readOnly={preview || !isOwner || eventMode !== 'edit'}
              label={slide.name}
              onUpdate={(value) => {
                updateSlide({ ...slide, name: value })
              }}
            />
          </div>
          {!preview && isOwner && eventMode === 'edit' && (
            <SlideActions
              triggerIcon={
                <div className="h-full w-fit bg-slate-100 rounded hidden group-hover:block">
                  <IconDots className="h-6 w-6 text-slate-500 px-1" />
                </div>
              }
              handleActions={(action) => handleActions(action, slide)}
            />
          )}
        </div>
      </div>
      <DeleteSlideModal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        handleDelete={handleDelete}
        slide={slide}
      />
    </div>
  )
}

type SlideActionKey = 'delete' | 'move-up' | 'move-down'

export function AgendaSlideCard({
  slide,
  index,
  draggableProps,
  displayType,
  isDragging,
}: AgendaSlideCardProps) {
  const {
    deleteSlide,
    moveUpSlide,
    moveDownSlide,
    setCurrentSlide,
    eventMode,
    isOwner,
  } = useContext(EventContext) as EventContextType

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const handleActions = (
    action: { key: SlideActionKey; label: string },
    actionSlide: ISlide
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: Record<SlideActionKey, any> = {
      delete: () => setIsDeleteModalOpen(true),
      'move-up': () => moveUpSlide(actionSlide),
      'move-down': () => moveDownSlide(actionSlide),
    }

    actions[action.key]()
  }

  const handleDelete = (_slide: ISlide) => {
    deleteSlide(_slide)
    setIsDeleteModalOpen(false)
  }

  const handleChangeSlide = (s: ISlide) => {
    if (!['edit', 'view'].includes(eventMode) && !isOwner) {
      return
    }

    setCurrentSlide(s)
  }

  if (displayType === 'thumbnail') {
    return (
      <SlideThumbnailView
        slide={slide}
        draggableProps={draggableProps}
        index={index}
        handleActions={handleActions}
        isDeleteModalOpen={isDeleteModalOpen}
        isDragging={isDragging}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDelete={handleDelete}
        onChangeSlide={() => handleChangeSlide(slide)}
      />
    )
  }

  return (
    <SlideListView
      slide={slide}
      draggableProps={draggableProps}
      index={index}
      handleActions={handleActions}
      isDeleteModalOpen={isDeleteModalOpen}
      isDragging={isDragging}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      handleDelete={handleDelete}
      onChangeSlide={() => handleChangeSlide(slide)}
    />
  )
}
