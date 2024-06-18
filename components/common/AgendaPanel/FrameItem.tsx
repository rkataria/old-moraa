/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useRef, useState } from 'react'

import { RxDotsVertical } from 'react-icons/rx'

import { AddItemBar } from './AddItemBar'
import { FrameThumbnailCard } from './FrameThumbnailCard'
import { ContentTypeIcon } from '../ContentTypeIcon'
import { DeleteFrameModal } from '../DeleteFrameModal'
import { EditableLabel } from '../EditableLabel'
import { FrameActions } from '../FrameActions'
import { FramePlaceholder } from '../FramePlaceholder'

import { EventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useDimensions } from '@/hooks/useDimensions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { getFrameName } from '@/utils/getFrameName'
import { cn } from '@/utils/utils'

type FrameItemProps = {
  frame: IFrame
}

type FrameActionKey = 'delete' | 'move-up' | 'move-down'

export function FrameItem({ frame }: FrameItemProps) {
  const {
    currentFrame,
    isOwner,
    preview,
    overviewOpen,
    eventMode,
    insertAfterFrameId,
    updateFrame,
    moveUpFrame,
    moveDownFrame,
    deleteFrame,
    setCurrentFrame,
  } = useContext(EventContext) as EventContextType
  const { listDisplayMode, currentSectionId } = useAgendaPanel()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const { leftSidebarVisiblity } = useStudioLayout()

  const handleFrameAction = (action: {
    key: FrameActionKey
    label: string
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: Record<FrameActionKey, any> = {
      delete: () => setIsDeleteModalOpen(true),
      'move-up': () => moveUpFrame(frame),
      'move-down': () => moveDownFrame(frame),
    }

    actions[action.key]()
  }

  const handleDelete = (_frame: IFrame) => {
    deleteFrame(_frame)
    setIsDeleteModalOpen(false)
  }

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  const { width: containerWidth } = useDimensions(thumbnailContainerRef)

  const editable = isOwner && !preview

  const frameActive =
    !overviewOpen && !currentSectionId && currentFrame?.id === frame.id

  const renderFrameContent = () => {
    if (sidebarExpanded) {
      return (
        <div
          data-miniframe-id={frame.id}
          className={cn(
            'cursor-pointer rounded-md border-0 hover:bg-purple-200 overflow-hidden',
            {
              'max-w-[calc(100%_-_2rem)]': listDisplayMode === 'grid',
              'w-full': listDisplayMode === 'list',
              'bg-purple-200': frameActive,
              'border-transparent':
                listDisplayMode === 'list' && currentFrame?.id !== frame.id,
            }
          )}
          onClick={() => {
            if (!isOwner && eventMode === 'present') return

            setCurrentFrame(frame)
          }}>
          <div
            className={cn(
              'relative flex flex-col transition-all duration-400 ease-in-out group/frame-item'
            )}>
            <div
              className={cn('w-full aspect-video bg-gray-100', {
                hidden: listDisplayMode === 'list',
                block: listDisplayMode === 'grid',
              })}>
              <div
                ref={thumbnailContainerRef}
                className="relative w-full h-full">
                <FrameThumbnailCard
                  frame={frame}
                  containerWidth={containerWidth}
                />
              </div>
            </div>
            <div
              className={cn(
                'flex justify-between items-center p-2 border-2 border-transparent',
                {
                  'border-purple-200': frameActive,
                  'border-gray-100':
                    currentFrame?.id !== frame.id && listDisplayMode === 'grid',
                }
              )}>
              <div className="flex justify-start items-center gap-2 flex-auto">
                <ContentTypeIcon
                  frameType={frame.type}
                  classNames="text-gray-800"
                />
                <EditableLabel
                  readOnly={!editable}
                  label={getFrameName({ frame })}
                  className="text-sm"
                  onUpdate={(value) => {
                    if (!editable) return
                    if (frame.name === value) return

                    updateFrame({
                      framePayload: { name: value },
                      frameId: frame.id,
                    })
                  }}
                />
              </div>

              {editable && (
                <div className={cn('hidden group-hover/frame-item:block')}>
                  <FrameActions
                    triggerIcon={
                      <div className="cursor-pointer">
                        <RxDotsVertical />
                      </div>
                    }
                    handleActions={handleFrameAction}
                  />
                </div>
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

    return (
      <div
        data-miniframe-id={frame.id}
        className={cn(
          'flex justify-center items-center cursor-pointer p-1.5 border-1 border-transparent hover:bg-purple-200',
          {
            'bg-purple-200': frameActive,
          }
        )}
        onClick={() => {
          setCurrentFrame(frame)
        }}>
        <ContentTypeIcon
          frameType={frame.type}
          classNames="text-gray-800"
          tooltipProps={{ placement: 'right', offset: 12 }}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {renderFrameContent()}
      {sidebarExpanded && (
        <AddItemBar sectionId={frame.section_id!} frameId={frame.id} />
      )}
      {insertAfterFrameId === frame.id && <FramePlaceholder />}
    </div>
  )
}
