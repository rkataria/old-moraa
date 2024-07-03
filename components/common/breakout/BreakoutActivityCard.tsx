/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef } from 'react'

import { IoAddSharp } from 'react-icons/io5'

import { Card } from '@nextui-org/react'

// TODO: Fix this.
// eslint-disable-next-line import/no-cycle
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { EditableLabel } from '../EditableLabel'
import { RenderIf } from '../RenderIf/RenderIf'

import { useEventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'

type BreakoutCardProps = {
  breakout: any
  idx: number
  participants?: any[]
  editable: boolean
} & (
  | {
      editable: boolean
      updateBreakoutGroupRoomNameName: (value: string, idx: number) => void
      deleteRoomGroup: (idx: number) => void
      onAddNewActivity: (index: number) => void
    }
  | {
      editable: false
      updateBreakoutGroupRoomNameName?: never
      deleteRoomGroup?: never
      onAddNewActivity?: never
    }
)

export function BreakoutActivityCard({
  breakout,
  editable,
  idx,
  updateBreakoutGroupRoomNameName,
  deleteRoomGroup,
  onAddNewActivity,
  participants,
}: BreakoutCardProps) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )
  const { setCurrentFrame, getCurrentFrame } = useEventContext()

  return (
    <Card className="border p-4 min-h-[260px]" key={breakout?.name}>
      <div className="flex justify-between gap-4">
        <EditableLabel
          readOnly={!editable}
          label={breakout?.name || ''}
          className="text-sm"
          onUpdate={(value) => {
            if (!editable) return
            // if (frame.content.breakout === value) return

            updateBreakoutGroupRoomNameName(value, idx)
          }}
        />
        <RenderIf isTrue={editable}>
          <span className="flex gap-2">
            <IoAddSharp
              className="border border-dashed border-gray-400 text-gray-400"
              onClick={() => {
                if (!editable) return
                onAddNewActivity(idx)
              }}
            />
            <IoAddSharp
              className="rotate-45"
              onClick={() => {
                if (!editable) return
                deleteRoomGroup(idx)
              }}
            />
          </span>
        </RenderIf>
      </div>
      <div className="border border-dashed border-gray-200 p-2 text-gray-400 mt-4 h-full min-w-48">
        {breakout?.activityId ? (
          <div
            ref={thumbnailContainerRef}
            className="relative w-full h-full"
            onClick={() => {
              if (!editable) return
              setCurrentFrame(getCurrentFrame(breakout?.activityId))
            }}>
            <FrameThumbnailCard
              frame={getCurrentFrame(breakout?.activityId)}
              containerWidth={containerWidth}
            />
          </div>
        ) : (
          <span
            onClick={() => {
              if (!editable) return
              onAddNewActivity(idx)
            }}>
            You can add existing slide from any section or add new slide which
            will be added under the Breakout section
          </span>
        )}
      </div>
      {!!participants && (
        <div className="mt-2">
          {participants?.length === 0 ? (
            <p className="text-sm text-gray-400">No participants</p>
          ) : null}
          {participants?.map((participant) => (
            <div className="flex items-center mb-2">
              <div>
                {participant.displayPictureUrl ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={participant.displayPictureUrl}
                    alt={participant.id}
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-2">
                    <p className="text-sm">
                      {participant.displayName?.split(' ')[0]?.[0]}
                      {participant.displayName?.split(' ')[1]?.[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
