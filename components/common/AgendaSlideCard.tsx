/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useRef, useState } from 'react'

import { IconDots } from '@tabler/icons-react'

import { Tooltip } from '@nextui-org/react'

import { DeleteSlideModal } from './DeleteSlideModal'
import { EditableLabel } from './EditableLabel'
import { SlideActions } from './SlideActions'
import { SlidePreview } from './SlidePreview'

import type {
  EventContextType,
  EventModeType,
} from '@/types/event-context.type'

import { EventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { type AgendaSlideDisplayType } from '@/types/event.type'
import { type ISlide } from '@/types/slide.type'
import { getContentType } from '@/utils/content.util'
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
  const { preview, eventMode, updateSlide, currentSlide, isOwner } = useContext(
    EventContext
  ) as EventContextType

  const contentType = getContentType(slide.type)

  return (
    <div
      className={cn(
        'relative group border-2 border-transparent rounded-sm hover:border-gray-300',
        {
          'bg-gray-200': currentSlide?.id === slide.id,
        }
      )}>
      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-500 group-hover:opacity-100 flex-none w-5 h-5 text-xs bg-gray-800 text-white rounded-full flex justify-center items-center">
        {index + 1}
      </div>
      <div
        data-minislide-id={slide.id}
        key={`mini-slide-${slide.id}`}
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
              'drop-shadow-sm rounded-[2px]': currentSlide?.id === slide.id,
              'drop-shadow-none': currentSlide?.id !== slide.id,
            }
          )}>
          {contentType && (
            <Tooltip content={contentType.name}>
              <div className={cn('text-slate-400 flex-none w-5 h-5')}>
                {contentType.icon}
              </div>
            </Tooltip>
          )}
          <div className={cn('shrink w-full')} onClick={onChangeSlide}>
            <EditableLabel
              readOnly={!isOwner || eventMode !== 'edit'}
              label={slide.name}
              className="text-sm"
              onUpdate={(value) => {
                if (slide.name === value) return

                updateSlide({
                  slidePayload: { name: value },
                  slideId: slide.id,
                })
              }}
            />
          </div>
          {isOwner && eventMode === 'edit' && (
            <SlideActions
              triggerIcon={
                <div className="cursor-pointer h-full w-fit bg-black/10 rounded hidden group-hover:block">
                  <IconDots className="h-5 w-5 text-white px-1" />
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

  const myRef = useRef(null)

  const actionDisabled = eventMode !== 'edit' || !isOwner || preview
  const contentType = getContentType(slide.type)

  const { width: cardWidth } = useDimensions(myRef)

  return (
    <div
      ref={myRef}
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className={cn('flex justify-start items-center gap-2 w-full bg-white', {
        'cursor-grab': isOwner && eventMode === 'edit' && !preview,
        'cursor-pointer': isOwner && eventMode === 'present' && !preview,
      })}
      {...(isDraggable({ eventMode, isOwner }) && draggableProps)}>
      <div
        onClick={onChangeSlide}
        className={cn(
          'relative rounded-md w-full aspect-video transition-all border-2 group overflow-hidden',
          currentSlide?.id === slide.id
            ? 'drop-shadow-md border-black'
            : 'drop-shadow-none border-black/20',
          isDragging && '!bg-primary/20'
        )}>
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-md z-0"
          style={{
            width: `${window.screen.width}px`,
            height: `${window.screen.height}px`,
            transformOrigin: 'left top',
            scale: `${(1 / window.screen.width) * cardWidth}`,
          }}>
          <SlidePreview slide={slide} key={JSON.stringify(slide.content)} />
        </div>
        <div className="flex-none absolute left-2 top-2 w-5 h-5 text-xs bg-black/20 text-white rounded-full flex justify-center items-center">
          {index + 1}
        </div>
        {contentType && (
          <div className="flex-none absolute right-2 top-2 p-1 bg-black/20 rounded-full flex justify-center items-center">
            <Tooltip content={contentType.name}>
              <div className={cn('text-white flex-none w-3 h-3')}>
                {contentType.icon}
              </div>
            </Tooltip>
          </div>
        )}
        <div className="absolute left-0 px-2 bottom-1 flex items-center justify-between w-full">
          <div className="shrink w-full">
            <EditableLabel
              readOnly={actionDisabled}
              label={slide.name}
              className="text-sm"
              onUpdate={(value) => {
                if (slide.name === value) return

                updateSlide({
                  slidePayload: { name: value },
                  slideId: slide.id,
                })
              }}
            />
          </div>
          {!preview && isOwner && eventMode === 'edit' && (
            <SlideActions
              triggerIcon={
                <div className="cursor-pointer h-full w-fit bg-black/20 rounded hidden group-hover:block">
                  <IconDots className="h-5 w-5 text-white px-1" />
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
        key={slide.id}
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
