/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useEffect, useRef, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
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
import { RenderIf } from '../RenderIf/RenderIf'

import { useBreakoutRooms } from '@/contexts/BreakoutRoomsManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useDimensions } from '@/hooks/useDimensions'
import { FrameStatus } from '@/services/types/enums'
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

export function BreakoutLive({ frame, isEditable = false }: BreakoutProps) {
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
  } = useEventContext()
  const { isHost } = useEventSession()
  const { meeting } = useDyteMeeting()
  const { isBreakoutActive } = useBreakoutRooms()

  const editable = isOwner && !preview && isEditable

  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )

  const [selectedBreakoutIndex, setSelectedBreakoutIndex] = useState<number>(0)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

  // console.log(
  //   meeting.connectedMeetings.currentMeetingId,
  //   meeting.connectedMeetings.meetings
  // )
  useEffect(() => {
    if (isHost) return
    if (!isBreakoutActive) return

    setTimeout(() => {
      const breakoutFrame = currentFrame?.content?.breakoutDetails?.find(
        (b, idx) =>
          meeting.connectedMeetings.meetings[idx].id ===
          meeting.connectedMeetings.currentMeetingId
      )

      if (breakoutFrame) {
        setCurrentFrame(getCurrentFrame(breakoutFrame.activityId as string))
      }
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const getCurrentFrame = (activityId: string): IFrame => {
    const section = sections.find((sec) =>
      sec.frames.find((f) => f.id === activityId)
    )
    const cFrame = section?.frames.find((f) => f.id === activityId) as IFrame

    return cFrame
  }

  const deleteRoomGroup = (idx: number): void => {
    // frame.content.breakoutDetails?.splice(idx, 1)
    // const payload = {
    //   content: {
    //     ...frame.content,
    //     breakoutDetails: [...(frame.content.breakoutDetails || [])],
    //   },
    // }

    deleteFrame(
      getCurrentFrame(frame.content?.breakoutDetails?.[idx]?.activityId)
    )
    const payload = {
      content: {
        ...frame.content,
        breakoutDetails: [
          ...(frame.content?.breakoutDetails?.slice(0, idx) || []),
          {
            ...(frame.content?.breakoutDetails?.[idx] || {}),
            ...{ activityId: null },
          },
          ...(frame.content?.breakoutDetails?.slice(idx + 1) || []),
        ],
      },
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
  }

  return (
    <div>
      <RenderIf isTrue={Boolean(frame.content?.breakoutDetails?.length)}>
        <RenderIf
          isTrue={frame.config.selectedBreakout === BREAKOUT_TYPES.ROOMS}>
          <div className="grid grid-cols-3 gap-2 grid-flow-col min-h-[280px]">
            {frame.content?.breakoutDetails?.map((breakout, idx) => (
              <div key={idx} className="mr-4">
                {!isBreakoutActive ? (
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
                ) : (
                  <BreakoutActivityCard
                    breakout={currentFrame?.content?.breakoutDetails?.[idx]}
                    deleteRoomGroup={() => null}
                    idx={0}
                    editable={false}
                    onAddNewActivity={() => null}
                    updateBreakoutGroupRoomNameName={() => null}
                    participants={
                      isHost
                        ? meeting.connectedMeetings.meetings?.[idx]
                            ?.participants
                        : undefined
                    }
                  />
                )}
              </div>
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
    </div>
  )
}
