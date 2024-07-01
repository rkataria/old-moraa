/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useContext, useRef, useState } from 'react'

import { IoAddSharp } from 'react-icons/io5'
import { v4 as uuidv4 } from 'uuid'

import { Card } from '@nextui-org/react'

// eslint-disable-next-line import/no-cycle
import { BreakoutActivityCard } from './BreakoutActivityCard'
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import {
  CANVAS_TEMPLATE_TYPES,
  ContentType,
  ContentTypePicker,
} from '../ContentTypePicker'
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
    selectedBreakout: string
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
    insertAfterFrameId,
    insertInSectionId,
    addFrameToSection,
    setCurrentFrame,
    updateFrame,
    deleteFrame,
    getCurrentFrame,
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
    templateType: CANVAS_TEMPLATE_TYPES | undefined
  ): void => {
    let currentSection
    const _insertAfterFrameId = insertAfterFrameId || currentFrame?.id

    if (insertInSectionId) {
      currentSection = sections.find((s) => s.id === insertInSectionId)
    } else {
      currentSection = sections.find((s) => s.id === currentFrame?.section_id)
    }

    const insertInSection = currentSection || sections[0]

    const frameConfig = {
      textColor: '#000',
      allowVoteOnMultipleOptions: false,
      showTitle: true,
      showDescription: [ContentType.COVER, ContentType.TEXT_IMAGE].includes(
        contentType
      ),
    }

    const newFrame: IFrame = {
      id: uuidv4(),
      name: `Frame ${(insertInSection?.frames?.length || 0) + 1}`,
      config: frameConfig,
      content: {
        ...(getDefaultContent({
          contentType,
          templateType,
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
    if (frame.config.selectedBreakout === BREAKOUT_TYPES.ROOMS) {
      payload = {
        content: {
          ...frame.content,
          breakoutDetails: [
            ...(frame.content?.breakoutDetails?.slice(
              0,
              selectedBreakoutIndex
            ) || []),
            {
              ...frame.content?.breakoutDetails?.[selectedBreakoutIndex],
              ...{
                activityId: newFrame.id,
              },
            },
            ...(frame.content?.breakoutDetails?.slice(
              selectedBreakoutIndex + 1
            ) || []),
          ],
        },
      }
    } else {
      payload = {
        content: {
          ...frame.content,
          breakoutDetails: frame.content?.breakoutDetails?.map(
            ({ details }) => ({
              ...details,
              activityId: newFrame.id,
            })
          ),
          activityId: newFrame.id,
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

  const updateBreakoutGroupRoomNameName = (name: string, idx: number): void => {
    const payload = {
      content: {
        ...frame.content,
        breakoutDetails: [
          ...(frame.content?.breakoutDetails?.slice(0, idx) || []),
          { ...(frame.content?.breakoutDetails?.[idx] || {}), ...{ name } },
          ...(frame.content?.breakoutDetails?.slice(idx + 1) || []),
        ],
      },
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
  }

  const deleteRoomGroup = (idx: number): void => {
    setIsDeleteModalOpen(true)
    setSelectedFrame(idx)
  }

  const handleDelete = (_frame: IFrame) => {
    deleteFrame(_frame)
    let payload = {}
    if (frame.config.selectedBreakout === BREAKOUT_TYPES.ROOMS) {
      payload = {
        content: {
          ...frame.content,
          breakoutDetails: [
            ...(frame.content?.breakoutDetails?.slice(0, selectedFrame) || []),
            {
              ...(frame.content?.breakoutDetails?.[selectedFrame] || {}),
              ...{ activityId: null },
            },
            ...(frame.content?.breakoutDetails?.slice(selectedFrame + 1) || []),
          ],
        },
      }
    } else {
      const breakoutDetails = frame.content?.breakoutDetails?.map(
        ({ details }) => ({
          ...details,
          activityId: null,
        })
      )

      console.log(breakoutDetails)

      payload = {
        content: {
          ...frame.content,
          breakoutDetails,
          groupActivityId: null,
        },
      }
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
    setSelectedFrame(-1)
    setIsDeleteModalOpen(false)
  }

  return (
    <div>
      <RenderIf isTrue={Boolean(frame.content?.breakoutDetails?.length)}>
        <RenderIf
          isTrue={frame.config.selectedBreakout === BREAKOUT_TYPES.ROOMS}>
          <div className="grid grid-cols-3 gap-2 grid-flow-col h-60">
            {frame.content?.breakoutDetails?.map((breakout, idx) => (
              <BreakoutActivityCard
                breakout={breakout}
                deleteRoomGroup={deleteRoomGroup}
                idx={idx}
                editable={editable}
                onAddNewActivity={() => {
                  setOpenContentTypePicker(true)
                  setSelectedBreakoutIndex(idx)
                }}
                updateBreakoutGroupRoomNameName={
                  updateBreakoutGroupRoomNameName
                }
              />
            ))}
          </div>
        </RenderIf>
        <RenderIf
          isTrue={frame.config.selectedBreakout === BREAKOUT_TYPES.GROUPS}>
          <Card key="breakout-group-activity" className="border p-4 w-full">
            <div className="flex justify-between gap-4">
              <span className="text-md font-semibold">Activities</span>
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
            <div className="border border-dashed border-gray-200 p-2 text-gray-400 mt-4 h-96 min-w-48">
              <RenderIf isTrue={Boolean(frame?.content?.activityId)}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                  ref={thumbnailContainerRef}
                  className="relative w-full h-full"
                  onClick={() => {
                    if (!editable) return
                    setCurrentFrame(
                      getCurrentFrame(frame?.content?.activityId as string)
                    )
                  }}>
                  <FrameThumbnailCard
                    frame={getCurrentFrame(
                      frame?.content?.activityId as string
                    )}
                    containerWidth={containerWidth}
                  />
                </div>
              </RenderIf>
              <RenderIf isTrue={!frame?.content?.activityId}>
                You can add existing slide from any section or add new slide
                which will be added under the Breakout section
              </RenderIf>
            </div>
          </Card>
        </RenderIf>
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
        frame={getCurrentFrame(
          frame.content?.breakoutDetails?.[selectedFrame]?.activityId
        )}
      />
    </div>
  )
}
