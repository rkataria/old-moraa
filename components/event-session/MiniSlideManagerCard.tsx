/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext, useState } from 'react'

import { IconDots, IconGripVertical } from '@tabler/icons-react'
import { DroppableProps } from 'react-beautiful-dnd'

import { Tooltip } from '@nextui-org/react'

import { SlideActions } from './SlideActions'
import { contentTypes } from '../event-content/ContentTypePicker'
import { DeleteSlideModal } from '../event-content/DeleteSlideModal'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { getSlideName } from '@/utils/getSlideName'
import { cn } from '@/utils/utils'

interface SlideListViewProps {
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

  const slideName = getSlideName(slide)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBlur = (e: any) => {
    updateSlide({ ...slide, name: e.target.value })
    setNameEditable(false)
  }

  if (nameEditable) {
    return (
      <input
        defaultValue={slideName}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur(e)}
        className="outline-none py-1 w-[inherit] pr-2 bg-transparent"
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
      {slideName}
    </p>
  )
}

function SlideListView({
  slide,
  draggableProps,
  index,
  mode,
  handleActions,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}: SlideListViewProps) {
  const { currentSlide, changeCurrentSlide, isHost, deleteSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const Icon = contentTypes.find(
    (type) => type.contentType === slide.type
  )?.icon

  const handleDelete = (slideData: ISlide) => {
    deleteSlide(slideData.id)
    setIsDeleteModalOpen(false)
  }

  return (
    <div
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className="flex justify-start items-center gap-2 max-w-full">
      <span className="w-8">{index + 1}</span>
      <Tooltip content={slide.type}>
        <div className="text-slate-500">{Icon}</div>
      </Tooltip>
      <div
        {...(mode === 'present' && draggableProps)}
        className={cn(
          'rounded-md flex-auto w-full transition-all flex items-center justify-between group',
          currentSlide?.id === slide.id ? 'drop-shadow-md' : 'drop-shadow-none'
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || '#FFFFFF',
        }}>
        <div>
          <IconGripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
        </div>
        <div
          className="shrink w-full cursor-pointer"
          onClick={() => {
            changeCurrentSlide(slide)
          }}>
          <SlideEditableName slide={slide} />
        </div>
        {isHost && (
          <SlideActions
            triggerIcon={
              <div className="h-full w-fit bg-slate-100 rounded mr-1 hidden group-hover:block">
                <IconDots className="h-6 w-6 text-slate-500 px-1" />
              </div>
            }
            handleActions={(action) => handleActions(action, slide.id)}
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
  mode,
  handleActions,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}: SlideThumbnailViewProps) {
  const { currentSlide, changeCurrentSlide, isHost, deleteSlide } = useContext(
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
          changeCurrentSlide(slide)
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
  miniSlideView: 'thumbnail' | 'list'
}

export function MiniSlideManagerCard({
  slide,
  index,
  draggableProps,
  mode,
  miniSlideView,
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

  if (miniSlideView === 'thumbnail') {
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

  return (
    <SlideListView
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
