import { useContext, useState } from 'react'

import { IconDots } from '@tabler/icons-react'
import { DroppableProps } from 'react-beautiful-dnd'

import { SlideActions } from './SlideActions'
import { DeleteSlideModal } from '../event-content/DeleteSlideModal'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { cn } from '@/utils/utils'

interface SlideThumbnailViewProps {
  slide: ISlide
  draggableProps: DroppableProps
  index: number
  mode: 'edit' | 'present' | 'read'
  handleActions: (
    action: { key: SlideActionKey; label: string },
    id: string
  ) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function SlideEditableName({ slide }: { slide: ISlide }) {
  const { updateSlide, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const [nameEditable, setNameEditable] = useState(false)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    updateSlide({ ...slide, name: e.target.value })
    setNameEditable(false)
  }

  if (nameEditable) {
    return (
      <input
        defaultValue={slide.name}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur(e)}
        className="border-b border-primary outline-none py-1 w-[inherit] pr-2"
      />
    )
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <p
      className="line-clamp-1 py-1"
      onClick={() => {
        if (isHost) setNameEditable(true)
      }}>
      {slide.name}
    </p>
  )
}

function SlideThumbnailView({
  slide,
  draggableProps,
  index,
  mode,
  handleActions,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}: SlideThumbnailViewProps) {
  const { currentSlide, setCurrentSlide, isHost, deleteSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const handleDelete = (_slide: ISlide) => {
    deleteSlide(_slide.id)
    setIsDeleteModalOpen(false)
  }

  return (
    <div
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className="flex justify-start items-center gap-2 w-full"
      {...(mode === 'present' && draggableProps)}>
      <span className="w-5">{index + 1}</span>
      <div
        onClick={() => {
          if (isHost) setCurrentSlide(slide)
        }}
        onKeyDown={() => {}}
        tabIndex={0}
        role="button"
        className={cn(
          'relative rounded-md w-full aspect-video transition-all border-2 capitalize group',
          currentSlide?.id === slide.id
            ? 'drop-shadow-md border-black'
            : 'drop-shadow-none border-black/20',
          { 'cursor-pointer': isHost }
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || '#FFFFFF',
        }}>
        <div className="absolute left-0 px-2 bottom-1 flex items-center justify-between w-full">
          <div className="shrink w-full">
            <SlideEditableName slide={slide} />
          </div>
          {isHost && (
            <SlideActions
              triggerIcon={
                <div className="h-full w-fit bg-slate-100 rounded hidden group-hover:block">
                  <IconDots className="h-6 w-6 text-slate-500 px-1" />
                </div>
              }
              handleActions={(action) => handleActions(action, slide.id)}
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

type SlideActionKey = 'delete' | 'moveUp' | 'moveDown'

interface IMiniSlideManagerCardProps {
  slide: ISlide
  index: number
  draggableProps: DroppableProps
  mode: 'edit' | 'present' | 'read'
}

export function MiniSlideManagerCard({
  slide,
  index,
  draggableProps,
  mode,
}: IMiniSlideManagerCardProps) {
  const { moveUpSlide, moveDownSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const handleActions = (
    action: { key: SlideActionKey; label: string },
    id: string
  ) => {
    const actions = {
      delete: () => setIsDeleteModalOpen(true),
      moveUp: () => moveUpSlide(id),
      moveDown: () => moveDownSlide(id),
    }

    actions[action.key]()
  }

  return (
    <SlideThumbnailView
      slide={slide}
      draggableProps={draggableProps}
      index={index}
      mode={mode}
      handleActions={handleActions}
      isDeleteModalOpen={isDeleteModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
    />
  )
}
