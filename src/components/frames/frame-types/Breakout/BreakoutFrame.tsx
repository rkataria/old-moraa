/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useEffect, useState } from 'react'

import { GoPlusCircle } from 'react-icons/go'
import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'

import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { FramePicker } from '@/components/common/FramePicker'
import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { FrameTitleDescriptionPanel } from '@/components/event-content/FrameTitleDescriptionPanel'
import { useEventContext } from '@/contexts/EventContext'
import { useBreakoutActivities } from '@/hooks/useBreakoutActivities'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'
import { useStoreSelector } from '@/hooks/useRedux'
import { FrameService } from '@/services/frame.service'
import { FrameStatus } from '@/types/enums'
import { IFrame } from '@/types/frame.type'
import { getDefaultContent } from '@/utils/content.util'
import { FrameType } from '@/utils/frame-picker.util'

// eslint-disable-next-line import/no-cycle

export type BreakoutFrame = IFrame & {
  content: {
    title: string
    description: string
    breakoutType: string
    countOfRoomsGroups: number
  }
}

interface BreakoutProps {
  frame: BreakoutFrame
  isEditable?: boolean
}

export function BreakoutFrame({ frame, isEditable = false }: BreakoutProps) {
  const { openModal } = useConfirmationModal()
  const {
    isOwner,
    preview,
    currentFrame,
    deleteFrame,
    getFrameById,
    eventMode,
    meeting,
  } = useEventContext()
  const isMeetingJoined = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )
  const breakoutActivityQuery = useBreakoutActivities({ frameId: frame.id })

  useEffect(() => {
    if (!breakoutActivityQuery.isSuccess) return

    if (breakoutActivityQuery.data?.length !== 0) return

    FrameService.createDefaultBreakoutActivities({
      breakoutFrameId: frame.id,
      // This config value only exist in case of rooms breakout. In group breakout we only need one activity so is the default value as one.
      count: frame.config.breakoutRoomsCount || 1,
    }).then(() => breakoutActivityQuery.refetch())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakoutActivityQuery.isSuccess])

  const editable = isOwner && !preview && isEditable

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

  const handleAddNewFrame = async (
    contentType: FrameType,
    templateKey?: string,
    existingFrame?: IFrame
  ) => {
    const frameConfig: IFrame['config'] = {
      textColor: '#000',
      allowVoteOnMultipleOptions: false,
    }

    if (contentType === FrameType.RICH_TEXT) {
      frameConfig.allowToCollaborate = true
    }

    const newFrame: IFrame = existingFrame || {
      id: uuidv4(),
      name: contentType,
      config: frameConfig,
      content: {
        ...(getDefaultContent({
          frameType: contentType,
          templateKey,
          // TODO: Fix any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any),
      },
      type: contentType,
      meeting_id: meeting!.id,
      status: FrameStatus.DRAFT,
    }

    if (!existingFrame) {
      await FrameService.createFrame(
        newFrame as IFrame & { meeting_id: string; section_id: string }
      )
    }

    FrameService.updateActivityBreakoutFrame({
      activityFrameId: newFrame.id,
      activityId: activeRoomId!,
    }).then(() => breakoutActivityQuery.refetch())

    setOpenContentTypePicker(false)
  }

  const updateBreakoutRoomName = (name: string, roomId: string): void => {
    FrameService.updateActivityBreakoutFrame({
      activityId: roomId,
      name,
    })
  }

  const handleBreakoutActivityFrameDelete = (roomId: string) => {
    FrameService.updateActivityBreakoutFrame({
      activityId: roomId,
      activityFrameId: null,
    }).then(() => breakoutActivityQuery.refetch())
    setActiveRoomId(null)
  }

  const handleBreakoutRoomDelete = (roomId: string, _frame: IFrame | null) => {
    if (_frame) {
      deleteFrame(_frame)
    }
    FrameService.deleteActivityBreakoutFrame({ activityId: roomId }).then(() =>
      breakoutActivityQuery.refetch()
    )
  }

  const addNewRoom = () => {
    if (!currentFrame) return
    FrameService.createActivityBreakoutFrame([
      {
        breakoutFrameId: currentFrame.id,
        name: 'Activity',
      },
    ]).then(() => breakoutActivityQuery.refetch())
  }

  if (breakoutActivityQuery.isLoading || !breakoutActivityQuery.data) {
    return null
  }

  return (
    <>
      {!editable ? (
        <FrameTitleDescriptionPreview frame={frame} />
      ) : (
        <FrameTitleDescriptionPanel key={frame.id} />
      )}
      <div className="w-full h-full">
        <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.ROOMS}>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {breakoutActivityQuery.data?.map((breakout: any) => (
              <BreakoutRoomActivityCard
                breakout={breakout}
                deleteRoomGroup={(deletingRoomId) => {
                  openModal({
                    title: 'Delete Room',
                    content: 'Are you sure you want to delete this room?',
                  }).then(() =>
                    handleBreakoutRoomDelete(
                      deletingRoomId,
                      getFrameById(breakout.activity_frame_id || '')
                    )
                  )
                }}
                hideRoomDelete={(breakoutActivityQuery.data?.length || 0) <= 2}
                editable={editable}
                onAddNewActivity={(roomId) => {
                  setActiveRoomId(roomId)
                  setOpenContentTypePicker(true)
                }}
                updateBreakoutRoomName={updateBreakoutRoomName}
                deleteActivityFrame={(deletingRoomId) => {
                  openModal({
                    title: 'Delete Activity',
                    content: 'Are you sure you want to delete this activity?',
                  }).then(() =>
                    handleBreakoutActivityFrameDelete(deletingRoomId)
                  )
                }}
              />
            ))}
            <RenderIf
              isTrue={!isMeetingJoined && !preview && eventMode === 'edit'}>
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <div
                className="relative grid place-items-center h-full w-full cursor-pointer border rounded-xl bg-white min-h-[200px] p-1 duration-300 hover:shadow-xl"
                onClick={addNewRoom}>
                <div className="w-full h-full rounded-lg flex flex-col justify-center items-center gap-2 bg-[#f9f6ff]">
                  <GoPlusCircle size={60} className="text-primary" />
                  <p className="text-primary text-center">Add new room</p>
                </div>
              </div>
            </RenderIf>
          </div>
        </RenderIf>
        <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.GROUPS}>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3">
            <BreakoutRoomActivityCard
              breakout={breakoutActivityQuery.data?.[0]}
              // deleteRoomGroup={(deletingIdx) =>
              //   setDeletingRoomIndex(deletingIdx)
              // }
              hideRoomDelete={false}
              editable={editable}
              onAddNewActivity={(roomId) => {
                setActiveRoomId(roomId)
                setOpenContentTypePicker(true)
              }}
              deleteActivityFrame={(roomId) => {
                openModal({
                  title: 'Delete Activity',
                  content: 'Are you sure you want to delete this activity?',
                }).then(() => handleBreakoutActivityFrameDelete(roomId))
              }}
            />
          </div>
        </RenderIf>

        <FramePicker
          open={openContentTypePicker}
          onClose={() => setOpenContentTypePicker(false)}
          onChoose={(content, templateType) => {
            handleAddNewFrame(content, templateType)
          }}
          isBreakoutActivity
          breakoutFrameId={currentFrame?.id}
          onBreakoutFrameImport={(importedFrame) =>
            handleAddNewFrame(importedFrame.type, '', importedFrame)
          }
        />
      </div>
    </>
  )
}
