/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useRef, useState } from 'react'

import { RxDotsVertical } from 'react-icons/rx'

import { AddItemBar } from './AddItemBar'
import { FrameThumbnailCard } from './FrameThumbnailCard'
import { ContentTypeIcon } from '../ContentTypeIcon'
import { ContentType } from '../ContentTypePicker'
import { DeleteFrameModal } from '../DeleteFrameModal'
import { EditableLabel } from '../EditableLabel'
import { FrameActions } from '../FrameActions'
import { RenderIf } from '../RenderIf/RenderIf'

import { EventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useDimensions } from '@/hooks/useDimensions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type FrameItemProps = {
  frame: IFrame
  duplicateFrame: (frame: IFrame) => void
}

type FrameActionKey = 'delete' | 'move-up' | 'move-down' | 'duplicate-frame'

export function FrameItem({ frame, duplicateFrame }: FrameItemProps) {
  const {
    currentFrame,
    isOwner,
    preview,
    overviewOpen,
    eventMode,
    updateFrame,
    moveUpFrame,
    moveDownFrame,
    deleteFrame,
    setCurrentFrame,
    deleteBreakoutFrames,
  } = useContext(EventContext) as EventContextType
  const { listDisplayMode, currentSectionId } = useAgendaPanel()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const { leftSidebarVisiblity } = useStudioLayout()
  const eventSessionData = useEventSession()

  const handleFrameAction = (action: {
    key: FrameActionKey
    label: string
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: Record<FrameActionKey, any> = {
      delete: () => setIsDeleteModalOpen(true),
      'move-up': () => moveUpFrame(frame),
      'move-down': () => moveDownFrame(frame),
      'duplicate-frame': () => duplicateFrame(frame),
    }

    actions[action.key]()
  }

  const handleDelete = async (_frame: IFrame) => {
    if (_frame.type === ContentType.BREAKOUT) {
      deleteBreakoutFrames(_frame)
    } else {
      deleteFrame(_frame)
    }
    setIsDeleteModalOpen(false)
  }

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    sidebarExpanded
  )

  const editable = isOwner && !preview && eventMode === 'edit'

  const frameActive =
    !overviewOpen && !currentSectionId && currentFrame?.id === frame?.id

  const renderFrameContent = () => {
    if (sidebarExpanded) {
      return (
        <div
          key={`frame-${frame?.id}`}
          data-miniframe-id={frame?.id}
          className={cn(
            'relative cursor-pointer rounded-md border-0  hover:bg-purple-200 overflow-hidden',
            {
              'max-w-[calc(100%_-_2rem)] border border-gray-300':
                listDisplayMode === 'grid',
              'w-full': listDisplayMode === 'list',
              'bg-purple-200': frameActive,
              'border-2 border-gray-600':
                frameActive && listDisplayMode === 'grid',
              'border-transparent':
                listDisplayMode === 'list' && currentFrame?.id !== frame?.id,
              'border border-green-700':
                eventSessionData?.breakoutSlideId === frame?.id,
            }
          )}
          onClick={() => {
            if (!isOwner && eventMode === 'present') return

            setCurrentFrame(frame)
          }}>
          {eventSessionData?.breakoutSlideId === frame?.id ? (
            <div className="absolute top-0 right-0 bg-secondary p-1 rounded-bl-md rounded-tr-md">
              <p className="text-xs text-gray-800">In Breakout</p>
            </div>
          ) : null}
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
                    currentFrame?.id !== frame?.id &&
                    listDisplayMode === 'grid',
                }
              )}>
              <div className="flex justify-start items-center gap-2 flex-auto">
                <ContentTypeIcon
                  frameType={frame.type}
                  classNames="text-gray-800"
                />
                <EditableLabel
                  readOnly={!editable}
                  label={frame.name}
                  className="text-sm tracking-tight"
                  onUpdate={(value) => {
                    if (!editable) return
                    if (frame.name === value) return

                    updateFrame({
                      framePayload: { name: value },
                      frameId: frame?.id,
                    })
                  }}
                />
              </div>
              <RenderIf isTrue={editable && !frame?.content?.breakoutFrameId}>
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
              </RenderIf>
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
        data-miniframe-id={frame?.id}
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
        <RenderIf isTrue={sidebarExpanded && !frame?.content?.breakoutFrameId}>
          <AddItemBar sectionId={frame.section_id!} frameId={frame?.id} />
        </RenderIf>
      )}
    </div>
  )
}
