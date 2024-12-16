/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { useNavigate, useRouter } from '@tanstack/react-router'
import { RxDotsVertical } from 'react-icons/rx'

import { ActiveBreakoutIndicator } from './ActiveBreakoutIndicator'
import { AddItemBar } from './AddItemBar'
import { FrameGridView } from './FrameGridView'
import { ContentTypeIcon } from '../ContentTypeIcon'
import { DeleteFrameModal } from '../DeleteFrameModal'
import { EditableLabel } from '../EditableLabel'
import { FrameActions } from '../FrameActions'
import { RenderIf } from '../RenderIf/RenderIf'
import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

type FrameItemProps = {
  frame: IFrame
  duplicateFrame: (frame: IFrame) => void
  saveFrameInLibrary: (frame: IFrame) => void
  actionDisabled: boolean
}

type FrameActionKey =
  | 'delete'
  | 'move-up'
  | 'move-down'
  | 'duplicate-frame'
  | 'save-frame-in-library'

export function FrameItem({
  frame,
  duplicateFrame,
  saveFrameInLibrary,
  actionDisabled,
}: FrameItemProps) {
  const {
    currentFrame,
    eventMode,
    updateFrame,
    moveUpFrame,
    moveDownFrame,
    deleteFrame,
    setCurrentFrame,
    deleteBreakoutFrames,
    setInsertAfterFrameId,
    setInsertInSectionId,
  } = useEventContext()
  const navigate = useNavigate()

  const router = useRouter()
  const searches = router.latestLocation.search as {
    action: string
  }

  const breakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId
  )
  const { permissions } = useEventPermissions()

  const { listDisplayMode, currentSectionId } = useAgendaPanel()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
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
      'duplicate-frame': () => duplicateFrame(frame),
      'save-frame-in-library': () => saveFrameInLibrary(frame),
    }

    actions[action.key]()
  }
  const dispatch = useStoreDispatch()
  const isMeetingJoined = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )
  const isHost = useStoreSelector(
    (store) => store.event.currentEvent.eventState.isCurrentUserOwnerOfEvent
  )
  const presentationStatus = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.presentationStatus
  )

  const isBreakoutActive = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isBreakoutActive
  )

  const handleDelete = async (_frame: IFrame) => {
    if (_frame.type === FrameType.BREAKOUT) {
      deleteBreakoutFrames(_frame)
    } else {
      deleteFrame(_frame)
    }
    setIsDeleteModalOpen(false)
  }

  const handleFrameItemClick = (clickedFrame: IFrame) => {
    if (!permissions.canUpdateFrame && eventMode === 'present') {
      return
    }

    if (isHost && eventMode === 'edit') {
      setInsertAfterFrameId(clickedFrame.id)
      setInsertInSectionId(clickedFrame.section_id!)
    }

    setCurrentFrame(clickedFrame)

    if (eventMode === 'edit') {
      navigate({
        search: { ...searches, frameId: clickedFrame.id },
      })
    }

    // Dispatch an action to update event session mode to 'Peek' if presentation is not started and user is the owner of the event
    if (
      isMeetingJoined &&
      isHost &&
      presentationStatus !== PresentationStatuses.STARTED
    ) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PEEK))
    }
  }

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  const frameActive = !currentSectionId && currentFrame?.id === frame?.id

  const breakoutRunning = isBreakoutActive && breakoutFrameId === frame.id

  const renderFrameContent = () => {
    if (sidebarExpanded) {
      if (listDisplayMode === 'grid') {
        return (
          <FrameGridView
            frame={frame}
            handleFrameAction={handleFrameAction}
            sidebarExpanded={sidebarExpanded}
            frameActive={frameActive}
            onClick={handleFrameItemClick}
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
              'border border-green-400': breakoutRunning,
            }
          )}
          onClick={() => {
            handleFrameItemClick(frame)
          }}>
          <RenderIf isTrue={breakoutRunning}>
            <ActiveBreakoutIndicator />
          </RenderIf>

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
                  readOnly={actionDisabled}
                  label={frame.name}
                  className="text-sm tracking-tight"
                  onUpdate={(value) => {
                    if (actionDisabled) return
                    if (frame.name === value) return

                    updateFrame({
                      framePayload: { name: value },
                      frameId: frame?.id,
                    })
                  }}
                />
              </div>
              <RenderIf
                isTrue={
                  !actionDisabled &&
                  !frame?.content?.breakoutFrameId &&
                  !frame?.content?.processing
                }>
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
      <Tooltip label={frame.name} placement="right" showArrow>
        <div
          data-miniframe-id={frame?.id}
          className={cn(
            'relative flex justify-center items-center pl-[1.375rem]',
            {
              '!pl-1': frame?.content?.breakoutFrameId,
            }
          )}>
          <Button
            variant="light"
            size="sm"
            isIconOnly
            className={cn(
              'm-auto py-1 !min-w-auto w-auto h-auto bg-transparent',
              {
                'bg-primary/30': frameActive,
              }
            )}
            onClick={() => {
              handleFrameItemClick(frame)
            }}>
            <ContentTypeIcon
              frameType={frame.type}
              classNames={cn('h-[1.375rem] w-[1.375rem] text-gray-500', {
                'text-primary': frameActive,
              })}
              tooltipProps={{
                isDisabled: true,
              }}
            />
          </Button>
        </div>
      </Tooltip>
    )
  }

  return (
    <div
      className={cn('relative w-full', {
        'w-fit': !sidebarExpanded,
      })}>
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
