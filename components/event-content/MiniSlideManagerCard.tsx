/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useState } from 'react'

import { IconDots, IconGripVertical } from '@tabler/icons-react'

import { Tooltip } from '@nextui-org/react'

import { contentTypes } from './ContentTypePicker'
import { DeleteSlideModal } from './DeleteSlideModal'
import { SlideActions } from './SlideActions'

import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import {
  IMiniSlideManagerType,
  ISlide,
  SlideManagerContextType,
} from '@/types/slide.type'
import { getSlideName } from '@/utils/getSlideName'
import { cn } from '@/utils/utils'

interface SlideListViewProps {
  slide: ISlide
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draggableProps: any
  index: number
  mode: 'edit' | 'present' | 'read'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions: any
  isDeleteModalOpen: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIsDeleteModalOpen: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDelete: any
}

interface SlideThumbnailViewProps {
  slide: ISlide
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draggableProps: any
  index: number
  mode: 'edit' | 'present' | 'read'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions: any
  isDeleteModalOpen: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIsDeleteModalOpen: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDelete: any
}

function SlideEditableName({ slide }: { slide: ISlide }) {
  const { updateSlide, isOwner } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const [nameEditable, setNameEditable] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBlur = (e: any) => {
    updateSlide({ ...slide, name: e.target.value })
    setNameEditable(false)
  }

  const slideName = getSlideName(slide)

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
    <p
      className="line-clamp-1 py-1"
      onClick={() => {
        if (isOwner) setNameEditable(true)
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
  handleDelete,
}: SlideListViewProps) {
  const { currentSlide, setCurrentSlide, isOwner } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType
  const Icon = contentTypes.find(
    (type) => type.contentType === slide.type
  )?.icon

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
        {...(mode === 'edit' && draggableProps)}
        className={cn(
          'rounded-md flex-auto w-full transition-all flex items-center justify-between group',
          currentSlide?.id === slide.id ? 'drop-shadow-md' : 'drop-shadow-none'
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || '#166534',
        }}>
        <div>
          <IconGripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
        </div>
        <div
          className="shrink w-full cursor-pointer"
          onClick={() => setCurrentSlide(slide)}>
          <SlideEditableName slide={slide} />
        </div>
        {isOwner && (
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
  handleDelete,
}: SlideThumbnailViewProps) {
  const { currentSlide, setCurrentSlide, isOwner } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  return (
    <div
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className="flex justify-start items-center gap-2 w-full"
      {...(mode === 'edit' && draggableProps)}>
      <span className="w-5">{index + 1}</span>
      <div
        onClick={() => setCurrentSlide(slide)}
        className={cn(
          'relative rounded-md w-full aspect-video cursor-pointer transition-all border-2 group',
          currentSlide?.id === slide.id
            ? 'drop-shadow-md border-black'
            : 'drop-shadow-none border-black/20'
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || '#166534',
        }}>
        <div className="absolute left-0 px-2 bottom-1 flex items-center justify-between w-full">
          <div
            className="shrink w-full cursor-pointer"
            onClick={() => setCurrentSlide(slide)}>
            <SlideEditableName slide={slide} />
          </div>
          {isOwner && (
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

export function MiniSlideManagerCard({
  slide,
  index,
  draggableProps,
  mode,
  miniSlideView,
}: IMiniSlideManagerType) {
  const { deleteSlide, moveUpSlide, moveDownSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const handleActions = (
    action: { key: SlideActionKey; label: string },
    id: string
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: Record<SlideActionKey, any> = {
      delete: () => setIsDeleteModalOpen(true),
      moveUp: () => moveUpSlide(id),
      moveDown: () => moveDownSlide(id),
    }

    actions[action.key]()
  }

  const handleDelete = (_slide: ISlide) => {
    deleteSlide(_slide.id)
    setIsDeleteModalOpen(false)
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
        handleDelete={handleDelete}
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
      handleDelete={handleDelete}
    />
  )
}
