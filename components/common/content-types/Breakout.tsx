'use client'

import 'tldraw/tldraw.css'

import { useContext, useRef, useState } from 'react'

import { IoAddSharp } from 'react-icons/io5'
import { v4 as uuidv4 } from 'uuid'

import { Card } from '@nextui-org/react'

// eslint-disable-next-line import/no-cycle
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import {
  CANVAS_TEMPLATE_TYPES,
  ContentType,
  ContentTypePicker,
} from '../ContentTypePicker'
import { EditableLabel } from '../EditableLabel'

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
}

export function Breakout({ frame }: BreakoutProps) {
  const {
    isOwner,
    preview,
    currentFrame,
    sections,
    insertAfterFrameId,
    insertInSectionId,
    addFrameToSection,
    updateFrame,
  } = useContext(EventContext) as EventContextType
  const editable = isOwner && !preview

  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )

  const [selectedBreakoutIndex, setSelectedBreakoutIndex] = useState<number>(0)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

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

    const payload = {
      content: {
        ...frame.content,
        breakoutDetails: [
          ...(frame.content?.breakoutDetails?.slice(0, selectedBreakoutIndex) ||
            []),
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

    updateFrame({ framePayload: payload, frameId: frame.id })
    addFrameToSection({
      frame: newFrame,
      section: insertInSection,
      afterFrameId: _insertAfterFrameId!,
    })
    setOpenContentTypePicker(false)
  }

  // console.log(frame)

  const updateBreakoutGroupRoomNameName = (name: string, idx: number): void => {
    const payload = {
      content: {
        ...frame.content,
        breakoutDetails: [
          ...(frame.content?.breakoutDetails?.slice(0, idx) || []),
          { name },
          ...(frame.content?.breakoutDetails?.slice(idx + 1) || []),
        ],
      },
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
  }

  const getCurrentFrame = (activityId: string): IFrame => {
    const section = sections.find((sec) =>
      sec.frames.find((f) => f.id === activityId)
    )
    const cFrame = section?.frames.find((f) => f.id === activityId) as IFrame

    return cFrame
  }

  const deleteRoomGroup = (idx: number): void => {
    frame.content.breakoutDetails?.splice(idx, 1)
    const payload = {
      content: {
        ...frame.content,
        breakoutDetails: [...(frame.content.breakoutDetails || [])],
      },
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
  }

  return (
    <div className="grid grid-cols-3 gap-2 h-72 grid-flow-col bottom-6 absolute">
      {frame.content?.breakoutDetails?.length &&
        frame.content?.breakoutDetails?.map((breakout, idx) => (
          <Card
            key={`breakout-${frame.config?.selectedBreakout}-${breakout?.name}`}
            className="border p-4 ">
            <div className="flex justify-between gap-4">
              <EditableLabel
                readOnly={!editable}
                label={breakout?.name || ''}
                className="text-sm"
                onUpdate={(value) => {
                  if (!editable) return
                  if (frame.content.breakout === value) return

                  updateBreakoutGroupRoomNameName(value, idx)
                }}
              />
              <span className="flex gap-2">
                <IoAddSharp
                  className="border border-dashed border-gray-400 text-gray-400"
                  onClick={() => {
                    setOpenContentTypePicker(true)
                    setSelectedBreakoutIndex(idx)
                  }}
                />
                {editable && (
                  <IoAddSharp
                    className="rotate-45"
                    onClick={() => deleteRoomGroup(idx)}
                  />
                )}
              </span>
            </div>
            <div className="border border-dashed border-gray-200 p-2 text-gray-400 mt-4 h-full min-w-48">
              {breakout?.activityId ? (
                <div
                  ref={thumbnailContainerRef}
                  className="relative w-full h-full">
                  <FrameThumbnailCard
                    frame={getCurrentFrame(breakout?.activityId)}
                    containerWidth={containerWidth}
                  />
                </div>
              ) : (
                `You can add existing slide from any section or add new slide which
              will be added under the Breakout section`
              )}
            </div>
          </Card>
        ))}

      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={(content, templateType) => {
          handleAddNewFrame(content, templateType)
        }}
      />
    </div>
  )
}
