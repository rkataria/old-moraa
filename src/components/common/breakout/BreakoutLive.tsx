/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useEffect, useRef } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { Card } from '@nextui-org/react'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import { RenderIf } from '../RenderIf/RenderIf'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useDimensions } from '@/hooks/useDimensions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { IFrame } from '@/types/frame.type'
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

export function BreakoutFrameLive({
  frame,
  isEditable = false,
}: BreakoutProps) {
  const dispatch = useStoreDispatch()
  const { isOwner, preview, currentFrame, getFrameById, setCurrentFrame } =
    useEventContext()
  const { isHost } = useEventSession()
  const { meeting } = useDyteMeeting()
  const { isBreakoutActive } = useBreakoutRooms()
  const activeSessionData = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
  )

  const editable = isOwner && !preview && isEditable

  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )

  useEffect(() => {
    if (!isBreakoutActive) {
      dispatch(
        updateMeetingSessionDataAction({
          slideAssignedToRooms: {},
        })
      )

      return
    }
    if (Object.keys(activeSessionData?.slideAssignedToRooms || {}).length) {
      return
    }
    const slideAssignedToRooms: { [x: string]: string } = {}
    if (currentFrame?.config.breakoutType === BREAKOUT_TYPES.ROOMS) {
      currentFrame?.content?.breakoutRooms?.forEach((b, idx) => {
        slideAssignedToRooms[
          meeting.connectedMeetings.meetings[idx].id as string
        ] = b.activityId as string
      })
      dispatch(
        updateMeetingSessionDataAction({
          slideAssignedToRooms,
        })
      )
    } else {
      meeting.connectedMeetings.meetings.forEach((meet) => {
        if (!meet.id) return
        slideAssignedToRooms[meet.id] = currentFrame?.content
          ?.groupActivityId as string
      })
      dispatch(
        updateMeetingSessionDataAction({
          slideAssignedToRooms,
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame, isBreakoutActive, isHost])

  return (
    <div>
      <RenderIf
        isTrue={frame.config.breakoutType === BREAKOUT_TYPES.ROOMS && isHost}>
        <div className="grid grid-cols-4 gap-2 h-auto overflow-y-auto min-h-[280px]">
          {frame.content?.breakoutRooms?.map((breakout, idx) => (
            <BreakoutRoomActivityCard
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
        isTrue={frame.config.breakoutType === BREAKOUT_TYPES.GROUPS && isHost}>
        <Card key="breakout-group-activity" className="border p-4 w-[65%]">
          <div className="flex justify-between gap-4">
            <span className="text-md font-semibold">Activity</span>
          </div>
          <div className="border border-dashed border-gray-200 text-gray-400 mt-4 h-96 flex items-center justify-center">
            <RenderIf isTrue={Boolean(frame?.content?.groupActivityId)}>
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <div
                ref={thumbnailContainerRef}
                className="relative w-full h-full"
                onClick={() => {
                  if (!editable) return
                  setCurrentFrame(
                    getFrameById(frame?.content?.groupActivityId as string)
                  )
                }}>
                <FrameThumbnailCard
                  frame={getFrameById(
                    frame?.content?.groupActivityId as string
                  )}
                  containerWidth={containerWidth}
                />
              </div>
            </RenderIf>
          </div>
        </Card>
      </RenderIf>
    </div>
  )
}
