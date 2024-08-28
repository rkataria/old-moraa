/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useState } from 'react'

import { RxDotsVertical } from 'react-icons/rx'

import { AddItemBar } from './AddItemBar'
import { FrameGridView } from './FrameGridView'
import { ContentTypeIcon } from '../ContentTypeIcon'
import { ContentType } from '../ContentTypePicker'
import { DeleteFrameModal } from '../DeleteFrameModal'
import { EditableLabel } from '../EditableLabel'
import { FrameActions } from '../FrameActions'
import { RenderIf } from '../RenderIf/RenderIf'

import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useEventPermissions } from '@/hooks/useEventPermissions'
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
  const { permissions } = useEventPermissions()

  const { listDisplayMode, currentSectionId } = useAgendaPanel()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
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

  const editable =
    permissions.canUpdateFrame && !preview && eventMode === 'edit'

  const frameActive =
    !overviewOpen && !currentSectionId && currentFrame?.id === frame?.id

  const renderFrameContent = () => {
    if (sidebarExpanded) {
      if (listDisplayMode === 'grid') {
        return (
          <FrameGridView
            frame={frame}
            handleFrameAction={handleFrameAction}
            sidebarExpanded={sidebarExpanded}
            editable={editable}
            frameActive={frameActive}
            eventSessionData={eventSessionData}
          />
        )
      }

      return (
        <div
          key={`frame-${frame?.id}`}
          data-miniframe-id={frame?.id}
          className={cn(
            'relative cursor-pointer rounded-md overflow-hidden hover:bg-gray-200',
            {
              'bg-primary-100': frameActive,
              'border-transparent': currentFrame?.id !== frame?.id,
              'border border-green-700':
                eventSessionData?.breakoutSlideId === frame?.id,
            }
          )}
          onClick={() => {
            if (!permissions.canUpdateFrame && eventMode === 'present') {
              return
            }

            setCurrentFrame(frame)
          }}>
          {eventSessionData?.breakoutSlideId === frame?.id ? (
            <div className="absolute top-0 right-0 p-1 bg-secondary rounded-bl-md rounded-tr-md">
              <p className="text-xs text-gray-800">In Breakout</p>
            </div>
          ) : null}
          <div
            className={cn(
              'relative flex flex-col transition-all duration-400 ease-in-out group/frame-item'
            )}>
            <div
              className={cn(
                'flex justify-between items-center px-2 h-8 hover:bg-gray-200 group-hover/frame-item:bg-gray-200',
                {
                  'bg-primary-100': frameActive,
                  'border-gray-100': currentFrame?.id !== frame?.id,
                }
              )}>
              <div className="flex items-center justify-start flex-auto gap-2">
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
        </div>
      )
    }

    return (
      <div
        data-miniframe-id={frame?.id}
        className={cn('flex justify-center items-center')}>
        <Button
          size="sm"
          isIconOnly
          className={cn('m-auto bg-gray-100 hover:bg-gray-200', {
            'bg-primary-200': frameActive,
          })}
          onClick={() => {
            setCurrentFrame(frame)
          }}>
          <ContentTypeIcon
            frameType={frame.type}
            classNames="text-black h-4 w-4"
            tooltipProps={{ placement: 'right', offset: 12 }}
          />
        </Button>
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
      <DeleteFrameModal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        handleDelete={handleDelete}
        frame={frame}
      />
    </div>
  )
}
