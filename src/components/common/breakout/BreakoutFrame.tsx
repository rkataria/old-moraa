/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useState } from 'react'

import { GoPlusCircle } from 'react-icons/go'
import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { DeleteBreakoutRoomModal } from './DeleteBreakoutRoomModal'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import { DeleteFrameModal } from '../DeleteFrameModal'
import { FramePicker } from '../FramePicker'
import { FrameTitleDescriptionPreview } from '../FrameTitleDescriptionPreview'
import { RenderIf } from '../RenderIf/RenderIf'

import { FrameTitleDescriptionPanel } from '@/components/event-content/FrameTitleDescriptionPanel'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'
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
  const {
    isOwner,
    preview,
    currentFrame,
    sections,
    insertInSectionId,
    addFrameToSection,
    updateFrame,
    deleteFrame,
    getFrameById,
    eventMode,
  } = useEventContext()
  const isMeetingJoined = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )

  const editable = isOwner && !preview && isEditable

  const [deletingRoomIndex, setDeletingRoomIndex] = useState(-1)
  const [deletingActivityFrameIndex, setDeletingActivityFrameIndex] =
    useState(-1)
  const [addingActivityRoomIndex, setAddingActivityRoomIndex] =
    useState<number>(0)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

  const handleAddNewFrame = (
    contentType: FrameType,
    templateKey?: string
  ): void => {
    let currentSection
    const _insertAfterFrameId = currentFrame?.id

    if (insertInSectionId) {
      currentSection = sections.find((s) => s.id === insertInSectionId)
    } else {
      currentSection = sections.find((s) => s.id === currentFrame?.section_id)
    }

    const insertInSection = currentSection || sections[0]

    const frameConfig: IFrame['config'] = {
      textColor: '#000',
      allowVoteOnMultipleOptions: false,
    }

    if (contentType === FrameType.RICH_TEXT) {
      frameConfig.allowToCollaborate = true
    }

    const newFrame: IFrame = {
      id: uuidv4(),
      name: `Frame ${(insertInSection?.frames?.length || 0) + 1}`,
      config: frameConfig,
      content: {
        ...(getDefaultContent({
          frameType: contentType,
          templateKey,
          // TODO: Fix any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any),
        ...{
          breakoutFrameId: frame.id,
        },
      },
      type: contentType,
      status: FrameStatus.DRAFT,
    }

    let payload = {}
    if (frame?.config?.breakoutType === BREAKOUT_TYPES.ROOMS) {
      if (
        frame?.content?.breakoutRooms?.[addingActivityRoomIndex]?.activityId
      ) {
        deleteFrame(
          getFrameById(
            frame.content?.breakoutRooms?.[addingActivityRoomIndex]
              ?.activityId || ''
          )
        )
      }
      payload = {
        content: {
          ...frame.content,
          breakoutRooms: [
            ...(frame.content?.breakoutRooms?.slice(
              0,
              addingActivityRoomIndex
            ) || []),
            {
              ...frame.content?.breakoutRooms?.[addingActivityRoomIndex],
              ...{
                activityId: newFrame.id,
              },
            },
            ...(frame.content?.breakoutRooms?.slice(
              addingActivityRoomIndex + 1
            ) || []),
          ],
        },
      }
    } else {
      if (frame.content?.groupActivityId) {
        deleteFrame(getFrameById(frame.content?.groupActivityId as string))
      }

      payload = {
        content: {
          ...frame.content,
          groupActivityId: newFrame.id,
        },
      }
    }

    addFrameToSection({
      frame: newFrame,
      section: insertInSection,
      afterFrameId: _insertAfterFrameId!,
    })
    setTimeout(
      () => updateFrame({ framePayload: payload, frameId: frame.id }),
      1000
    )
    setOpenContentTypePicker(false)
  }

  const updateBreakoutRoomName = (name: string, idx: number): void => {
    const payload = {
      content: {
        ...frame.content,
        breakoutRooms: [
          ...(frame.content?.breakoutRooms?.slice(0, idx) || []),
          {
            ...(frame.content?.breakoutRooms?.[idx] || {}),
            ...{ name, id: frame.content?.breakoutRooms?.[idx].id as string },
          },
          ...(frame.content?.breakoutRooms?.slice(idx + 1) || []),
        ],
      },
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
  }

  const handleBreakoutActivityFrameDelete = (_frame: IFrame | null) => {
    if (!_frame) return
    let payload = {}
    if (frame.config.breakoutType === BREAKOUT_TYPES.ROOMS) {
      payload = {
        content: {
          ...frame.content,
          breakoutRooms:
            frame.content?.breakoutRooms?.map((activity, breakoutRoomIndex) =>
              breakoutRoomIndex === deletingActivityFrameIndex
                ? { ...activity, activityId: null }
                : activity
            ) || [],
        },
        config: {
          ...frame.config,
        },
      }
    } else {
      payload = {
        content: {
          ...frame.content,
          groupActivityId: null,
        },
      }
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
    setTimeout(() => deleteFrame(_frame), 1000)
    setDeletingActivityFrameIndex(-1)
  }

  const handleBreakoutRoomDelete = (_frame: IFrame | null) => {
    if (_frame) {
      deleteFrame(_frame)
    }
    let payload = {}
    if (frame.config.breakoutType === BREAKOUT_TYPES.ROOMS) {
      // Remove assigned participants from the room
      const breakoutRoomAssignments =
        JSON.parse(JSON.stringify(frame.content?.breakoutRoomAssignments)) || {}
      const deletingRoomId =
        frame.content?.breakoutRooms?.[deletingRoomIndex]?.id

      Object.keys(breakoutRoomAssignments).forEach((roomId: string) => {
        if (roomId === deletingRoomId && breakoutRoomAssignments?.[roomId]) {
          delete breakoutRoomAssignments[roomId]
        }
      })

      const filteredBreakoutRooms =
        frame.content?.breakoutRooms?.filter(
          (_, breakoutRoomIndex) => breakoutRoomIndex !== deletingRoomIndex
        ) || []
      payload = {
        content: {
          ...frame.content,
          breakoutRooms: filteredBreakoutRooms,
          breakoutRoomAssignments,
        },
        config: {
          ...frame.config,
          breakoutRoomsCount: filteredBreakoutRooms.length,
        },
      }
    } else {
      payload = {
        content: {
          ...frame.content,
          groupActivityId: null,
        },
      }
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
    setDeletingRoomIndex(-1)
  }

  const addNewRoom = () => {
    if (!currentFrame) return
    const nextRoomCount =
      (currentFrame?.content?.breakoutRooms?.length || 0) + 1
    updateFrame({
      framePayload: {
        config: {
          ...currentFrame?.config,
          breakoutRoomsCount: nextRoomCount,
        },
        content: {
          ...currentFrame?.content,
          breakoutRooms: [
            ...(currentFrame?.content?.breakoutRooms || []),
            {
              name: `Room - ${nextRoomCount}`,
              id: uuidv4(),
            },
          ],
        },
      },
      frameId: currentFrame.id,
    })
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
            {frame.content?.breakoutRooms?.map((breakout, idx) => (
              <BreakoutRoomActivityCard
                breakout={breakout}
                deleteRoomGroup={(deletingIdx) =>
                  setDeletingRoomIndex(deletingIdx)
                }
                hideRoomDelete={
                  (frame.content?.breakoutRooms?.length || 0) <= 2
                }
                idx={idx}
                editable={editable}
                onAddNewActivity={() => {
                  setOpenContentTypePicker(true)
                  setAddingActivityRoomIndex(idx)
                }}
                updateBreakoutRoomName={updateBreakoutRoomName}
                deleteActivityFrame={(deletingIdx) =>
                  setDeletingActivityFrameIndex(deletingIdx)
                }
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
              breakout={{
                name: 'Group Activity',
                activityId: frame?.content?.groupActivityId,
              }}
              deleteRoomGroup={(deletingIdx) =>
                setDeletingRoomIndex(deletingIdx)
              }
              hideRoomDelete={(frame.content?.breakoutRooms?.length || 0) <= 2}
              idx={0}
              editable={editable}
              onAddNewActivity={() => {
                setOpenContentTypePicker(true)
              }}
              deleteActivityFrame={() =>
                handleBreakoutActivityFrameDelete(
                  getFrameById(frame?.content?.groupActivityId || '')
                )
              }
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
        />
        <DeleteFrameModal
          isModalOpen={deletingActivityFrameIndex !== -1}
          onClose={() => setDeletingActivityFrameIndex(-1)}
          handleDelete={handleBreakoutActivityFrameDelete}
          frame={getFrameById(
            frame.content?.breakoutRooms?.[deletingActivityFrameIndex]
              ?.activityId as string
          )}
        />
        <DeleteBreakoutRoomModal
          isModalOpen={deletingRoomIndex !== -1}
          onClose={() => setDeletingRoomIndex(-1)}
          handleDelete={handleBreakoutRoomDelete}
          frame={getFrameById(
            frame.content?.breakoutRooms?.[deletingRoomIndex]
              ?.activityId as string
          )}
        />
      </div>
    </>
  )
}
