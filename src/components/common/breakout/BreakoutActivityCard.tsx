/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef } from 'react'

import { BsTrash } from 'react-icons/bs'
import { IoAddSharp } from 'react-icons/io5'

// TODO: Fix this.
// eslint-disable-next-line import/no-cycle
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { EditableLabel } from '../EditableLabel'
import { RenderIf } from '../RenderIf/RenderIf'
import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { cn } from '@/utils/utils'

type BreakoutRoomActivityCardProps = {
  breakout: any
  idx: number
  hideActivityCard?: boolean
  participants?: {
    id?: string
    displayName?: string
    displayPictureUrl?: string
  }[]
  editable: boolean
} & (
  | {
      editable: boolean
      updateBreakoutRoomName: (value: string, idx: number) => void
      deleteRoomGroup: (idx: number) => void
      onAddNewActivity: (index: number) => void
    }
  | {
      editable: false
      updateBreakoutRoomName?: never
      deleteRoomGroup?: never
      onAddNewActivity?: never
    }
)

export function BreakoutRoomActivityCard({
  breakout,
  editable,
  idx,
  hideActivityCard = false,
  updateBreakoutRoomName,
  deleteRoomGroup,
  onAddNewActivity,
  participants,
}: BreakoutRoomActivityCardProps) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )
  const { setCurrentFrame, getFrameById } = useEventContext()

  return (
    <div
      className={cn('border rounded p-2', {
        // 'min-h-[120px]': !hideActivityCard,
      })}
      key={breakout?.name}>
      <div className="flex justify-between gap-4">
        <EditableLabel
          readOnly={!editable}
          label={breakout?.name || ''}
          className="text-sm"
          onUpdate={(value) => {
            if (!editable) return
            // if (frame.content.breakout === value) return

            updateBreakoutRoomName(value, idx)
          }}
        />
        <RenderIf isTrue={editable}>
          <span className="flex">
            <RenderIf isTrue={!breakout?.activityId}>
              <Button
                isIconOnly
                variant="light"
                onClick={() => {
                  if (!editable) return
                  onAddNewActivity(idx)
                }}>
                <IoAddSharp size={18} className="text-gray-400" />
              </Button>
            </RenderIf>

            <RenderIf isTrue={breakout?.activityId}>
              <Button
                isIconOnly
                variant="light"
                onClick={() => {
                  if (!editable) return
                  deleteRoomGroup(idx)
                }}>
                <BsTrash className="text-red-400" />
              </Button>
            </RenderIf>
          </span>
        </RenderIf>
      </div>
      <RenderIf isTrue={!hideActivityCard}>
        <div className="border border-dashed border-gray-200 text-gray-400 mt-4 h-40 min-w-48">
          {breakout?.activityId ? (
            <div
              ref={thumbnailContainerRef}
              className="relative w-full h-full"
              onClick={() => {
                if (!editable) return
                setCurrentFrame(getFrameById(breakout?.activityId))
              }}>
              <FrameThumbnailCard
                frame={getFrameById(breakout?.activityId)}
                containerWidth={containerWidth}
                inViewPort
              />
            </div>
          ) : (
            <div
              className="flex justify-center items-center p-2 text-center"
              onClick={() => {
                if (!editable) return
                onAddNewActivity(idx)
              }}>
              Add new slide which will be added under the Breakout section
            </div>
          )}
        </div>
      </RenderIf>
      {!!participants && (
        <div className="flex items-center mt-2">
          {participants?.length === 0 ? (
            <p className="text-sm text-gray-400">No participants</p>
          ) : null}
          {participants?.map((participant) => (
            <div className="mb-2 items-center mr-2">
              <Tooltip content={participant?.displayName || ''}>
                {participant?.displayPictureUrl ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={participant?.displayPictureUrl || ''}
                    alt={participant?.id}
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">
                    <p className="text-sm">
                      {participant?.displayName?.split(' ')[0]?.[0]}
                      {participant?.displayName?.split(' ')[1]?.[0]}
                    </p>
                  </div>
                )}
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
