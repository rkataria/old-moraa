/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useEffect, useRef } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import { Card } from '@nextui-org/react'

// eslint-disable-next-line import/no-cycle
import { BreakoutActivityCard } from './BreakoutActivityCard'
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import { RenderIf } from '../RenderIf/RenderIf'

import { useBreakoutRooms } from '@/contexts/BreakoutRoomsManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useDimensions } from '@/hooks/useDimensions'
import { IFrame } from '@/types/frame.type'
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
  const { isOwner, preview, currentFrame, sections, setCurrentFrame } =
    useEventContext()
  const { isHost } = useEventSession()
  const { meeting } = useDyteMeeting()
  const { isBreakoutActive } = useBreakoutRooms()

  const editable = isOwner && !preview && isEditable

  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )

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

  const getCurrentFrame = (activityId: string): IFrame => {
    const section = sections.find((sec) =>
      sec.frames.find((f) => f.id === activityId)
    )
    const cFrame = section?.frames.find((f) => f.id === activityId) as IFrame

    return cFrame
  }

  return (
    <div>
      <RenderIf isTrue={Boolean(frame.content?.breakoutDetails?.length)}>
        <RenderIf
          isTrue={frame.config.selectedBreakout === BREAKOUT_TYPES.ROOMS}>
          <div className="grid grid-cols-4 gap-2 h-auto overflow-y-auto min-h-[280px]">
            {frame.content?.breakoutDetails?.map((breakout, idx) => (
              <BreakoutActivityCard
                idx={idx}
                editable={false}
                breakout={breakout}
                participants={
                  isHost && isBreakoutActive
                    ? meeting.connectedMeetings.meetings?.[idx]?.participants
                    : undefined
                }
              />
            ))}
          </div>
        </RenderIf>
        <RenderIf
          isTrue={frame.config.selectedBreakout === BREAKOUT_TYPES.GROUPS}>
          <Card key="breakout-group-activity" className="border p-4 w-[75%]">
            <div className="flex justify-between gap-4">
              <span className="text-md font-semibold">Activity</span>
            </div>
            <div className="border border-dashed border-gray-200 p-2 text-gray-400 mt-4 h-96 flex items-center justify-center">
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
    </div>
  )
}
