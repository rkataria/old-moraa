/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useContext, useRef, useState } from 'react'

import { Card } from '@nextui-org/react'
import { IoAddSharp } from 'react-icons/io5'
import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import { ContentType, ContentTypePicker } from '../ContentTypePicker'
import { DeleteFrameModal } from '../DeleteFrameModal'
import { RenderIf } from '../RenderIf/RenderIf'

import { EventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { FrameStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { getDefaultContent } from '@/utils/content.util'
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
    setCurrentFrame,
    updateFrame,
    deleteFrame,
    getFrameById,
  } = useContext(EventContext) as EventContextType

  const editable = isOwner && !preview && isEditable

  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )

  const [selectedBreakoutIndex, setSelectedBreakoutIndex] = useState<number>(0)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [selectedFrame, setSelectedFrame] = useState<number>(-1)

  const handleAddNewFrame = (
    contentType: ContentType,
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

    const frameConfig = {
      textColor: '#000',
      allowVoteOnMultipleOptions: false,
    }

    const newFrame: IFrame = {
      id: uuidv4(),
      name: `Frame ${(insertInSection?.frames?.length || 0) + 1}`,
      config: frameConfig,
      content: {
        ...(getDefaultContent({
          contentType,
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
      if (frame?.content?.breakoutRooms?.[selectedBreakoutIndex]?.activityId) {
        deleteFrame(
          getFrameById(
            frame.content?.breakoutRooms?.[selectedBreakoutIndex]?.activityId ||
              ''
          )
        )
      }
      payload = {
        content: {
          ...frame.content,
          breakoutRooms: [
            ...(frame.content?.breakoutRooms?.slice(0, selectedBreakoutIndex) ||
              []),
            {
              ...frame.content?.breakoutRooms?.[selectedBreakoutIndex],
              ...{
                activityId: newFrame.id,
              },
            },
            ...(frame.content?.breakoutRooms?.slice(
              selectedBreakoutIndex + 1
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

    updateFrame({ framePayload: payload, frameId: frame.id })
    addFrameToSection({
      frame: newFrame,
      section: insertInSection,
      afterFrameId: _insertAfterFrameId!,
    })
    setOpenContentTypePicker(false)
  }

  const updateBreakoutRoomName = (name: string, idx: number): void => {
    const payload = {
      content: {
        ...frame.content,
        breakoutRooms: [
          ...(frame.content?.breakoutRooms?.slice(0, idx) || []),
          { ...(frame.content?.breakoutRooms?.[idx] || {}), ...{ name } },
          ...(frame.content?.breakoutRooms?.slice(idx + 1) || []),
        ],
      },
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
  }

  const deleteRoomActivity = (idx: number): void => {
    setIsDeleteModalOpen(true)
    setSelectedFrame(idx)
  }

  const handleDelete = (_frame: IFrame) => {
    deleteFrame(_frame)
    let payload = {}
    if (frame.config.breakoutType === BREAKOUT_TYPES.ROOMS) {
      payload = {
        content: {
          ...frame.content,
          breakoutRooms: [
            ...(frame.content?.breakoutRooms?.slice(0, selectedFrame) || []),
            {
              ...(frame.content?.breakoutRooms?.[selectedFrame] || {}),
              ...{ activityId: null },
            },
            ...(frame.content?.breakoutRooms?.slice(selectedFrame + 1) || []),
          ],
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
    setSelectedFrame(-1)
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="ml-8 mt-6">
      <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.ROOMS}>
        <div className="grid grid-cols-4 gap-2 h-auto overflow-y-auto min-h-[280px]">
          {frame.content?.breakoutRooms?.map((breakout, idx) => (
            <BreakoutRoomActivityCard
              breakout={breakout}
              deleteRoomGroup={deleteRoomActivity}
              idx={idx}
              editable={editable}
              onAddNewActivity={() => {
                setOpenContentTypePicker(true)
                setSelectedBreakoutIndex(idx)
              }}
              updateBreakoutRoomName={updateBreakoutRoomName}
            />
          ))}
        </div>
      </RenderIf>
      <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.GROUPS}>
        <Card key="breakout-group-activity" className="border p-4 w-[75%]">
          <div className="flex justify-between gap-4">
            <span className="text-md font-semibold">Activity</span>
            <RenderIf isTrue={editable}>
              <span className="flex gap-2">
                <IoAddSharp
                  className="border border-dashed border-gray-400 text-gray-400"
                  onClick={() => {
                    setOpenContentTypePicker(true)
                  }}
                />
              </span>
            </RenderIf>
          </div>
          <div className="border border-dashed border-gray-200 p-2 text-gray-400 mt-4 h-96 flex items-center justify-center">
            <RenderIf isTrue={Boolean(frame?.content?.groupActivityId)}>
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <div
                ref={thumbnailContainerRef}
                className="relative w-full h-full"
                onClick={() => {
                  if (!editable) return
                  setCurrentFrame(
                    getFrameById(frame?.content?.groupActivityId || '')
                  )
                }}>
                <FrameThumbnailCard
                  frame={getFrameById(frame?.content?.groupActivityId || '')}
                  containerWidth={containerWidth}
                />
              </div>
            </RenderIf>
            <RenderIf isTrue={!frame?.content?.groupActivityId}>
              <div className="text-center p-10">
                You can add existing slide from any section or add new slide
                which will be added under the Breakout section
              </div>
            </RenderIf>
          </div>
        </Card>
      </RenderIf>

      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={(content, templateType) => {
          handleAddNewFrame(content, templateType)
        }}
        isBreakoutActivity
      />
      <DeleteFrameModal
        isModalOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedFrame(-1)
        }}
        handleDelete={handleDelete}
        frame={getFrameById(
          frame.content?.breakoutRooms?.[selectedFrame]?.activityId as string
        )}
      />
    </div>
  )
}
