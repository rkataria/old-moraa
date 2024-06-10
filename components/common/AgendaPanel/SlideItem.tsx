/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useRef, useState } from 'react'

import { RxDotsVertical } from 'react-icons/rx'

import { AddItemBar } from './AddItemBar'
import { SlideThumbnailCard } from './SlideThumbnailCard'
import { ContentTypeIcon } from '../ContentTypeIcon'
import { DeleteSlideModal } from '../DeleteSlideModal'
import { EditableLabel } from '../EditableLabel'
import { SlideActions } from '../SlideActions'

import { EventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useDimensions } from '@/hooks/useDimensions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'
import { getSlideName } from '@/utils/getSlideName'
import { cn } from '@/utils/utils'

type SlideItemProps = {
  slide: ISlide
}

type SlideActionKey = 'delete' | 'move-up' | 'move-down'

export function SlideItem({ slide }: SlideItemProps) {
  const {
    currentSlide,
    isOwner,
    preview,
    updateSlide,
    moveUpSlide,
    moveDownSlide,
    deleteSlide,
    setCurrentSlide,
  } = useContext(EventContext) as EventContextType
  const { listDisplayMode } = useAgendaPanel()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const { leftSidebarVisiblity } = useStudioLayout()

  const handleSlideAction = (action: {
    key: SlideActionKey
    label: string
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: Record<SlideActionKey, any> = {
      delete: () => setIsDeleteModalOpen(true),
      'move-up': () => moveUpSlide(slide),
      'move-down': () => moveDownSlide(slide),
    }

    actions[action.key]()
  }

  const handleDelete = (_slide: ISlide) => {
    deleteSlide(_slide)
    setIsDeleteModalOpen(false)
  }

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  const { width: containerWidth } = useDimensions(thumbnailContainerRef)

  const editable = isOwner && !preview

  const renderSlideContent = () => {
    if (sidebarExpanded) {
      return (
        <div
          data-minislide-id={slide.id}
          className={cn('cursor-pointer border-0 hover:bg-purple-200', {
            'max-w-[calc(100%_-_2rem)]': listDisplayMode === 'grid',
            'w-full': listDisplayMode === 'list',
            'bg-purple-200': currentSlide?.id === slide.id,
            'border-transparent':
              listDisplayMode === 'list' && currentSlide?.id !== slide.id,
          })}
          onClick={() => {
            setCurrentSlide(slide)
          }}>
          <div
            className={cn(
              'relative flex flex-col transition-all duration-400 ease-in-out group/slide-item'
            )}>
            <div
              className={cn('w-full aspect-video bg-gray-100', {
                hidden: listDisplayMode === 'list',
                block: listDisplayMode === 'grid',
              })}>
              <div
                ref={thumbnailContainerRef}
                className="relative w-full h-full">
                <SlideThumbnailCard
                  slide={slide}
                  containerWidth={containerWidth}
                />
              </div>
            </div>
            <div
              className={cn(
                'flex justify-between items-center p-2 border-2 border-transparent',
                {
                  'border-purple-200': currentSlide?.id === slide.id,
                  'border-gray-100':
                    currentSlide?.id !== slide.id && listDisplayMode === 'grid',
                }
              )}>
              <div className="flex justify-start items-center gap-2 flex-auto">
                <ContentTypeIcon
                  slideType={slide.type}
                  classNames="text-gray-800"
                />
                <EditableLabel
                  readOnly={!editable}
                  label={getSlideName({ slide })}
                  className="text-sm"
                  onUpdate={(value) => {
                    if (!editable) return
                    if (slide.name === value) return

                    updateSlide({
                      slidePayload: { name: value },
                      slideId: slide.id,
                    })
                  }}
                />
              </div>

              {editable && (
                <div className={cn('hidden group-hover/slide-item:block')}>
                  <SlideActions
                    triggerIcon={
                      <div className="cursor-pointer">
                        <RxDotsVertical />
                      </div>
                    }
                    handleActions={handleSlideAction}
                  />
                </div>
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

    return (
      <div
        data-minislide-id={slide.id}
        className={cn(
          'flex justify-center items-center cursor-pointer p-1.5 border-1 border-transparent hover:bg-purple-200',
          {
            'bg-purple-200': currentSlide?.id === slide.id,
          }
        )}
        onClick={() => {
          setCurrentSlide(slide)
        }}>
        <ContentTypeIcon
          slideType={slide.type}
          classNames="text-gray-800"
          tooltipProps={{ placement: 'right', offset: 12 }}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      {renderSlideContent()}
      {sidebarExpanded && (
        <AddItemBar sectionId={slide.section_id!} slideId={slide.id} />
      )}
    </div>
  )
}
