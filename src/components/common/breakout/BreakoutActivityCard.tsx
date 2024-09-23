/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef } from 'react'

import { IconTrash } from '@tabler/icons-react'
import { IoEllipsisVerticalOutline } from 'react-icons/io5'
import { PiNoteBlankLight } from 'react-icons/pi'
import { TbApps, TbAppsFilled } from 'react-icons/tb'
import { TiDocumentDelete } from 'react-icons/ti'

// TODO: Fix this.
// eslint-disable-next-line import/no-cycle
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { DropdownActions } from '../DropdownActions'
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
  deleteActivityFrame?: (idx: number) => void
  updateBreakoutRoomName?: (value: string, idx: number) => void
  deleteRoomGroup?: (idx: number) => void
  onAddNewActivity?: (index: number) => void
  hideRoomDelete?: boolean
  JoinRoomButton?: React.ReactElement
}

export const roomActions = [
  {
    key: 'delete-room',
    label: 'Delete room',
    icon: <IconTrash className="text-slate-500" size={20} />,
  },
  {
    key: 'add-activity',
    label: 'Add activity in room',
    icon: <TbApps className="text-slate-500" size={20} />,
  },
  {
    key: 'delete-room-activity',
    label: 'Remove activity from room',
    icon: <TiDocumentDelete className="text-slate-500" size={20} />,
  },
]

export function BreakoutRoomActivityCard({
  breakout,
  editable,
  idx,
  hideActivityCard = false,
  updateBreakoutRoomName,
  deleteRoomGroup,
  deleteActivityFrame,
  onAddNewActivity,
  hideRoomDelete,
  participants,
  JoinRoomButton,
}: BreakoutRoomActivityCardProps) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )
  const { setCurrentFrame, getFrameById } = useEventContext()

  const getActions = () => {
    const actions = []

    if (!hideRoomDelete) {
      actions.push(roomActions[0])
    }

    if (breakout?.activityId) {
      actions.push(roomActions[2])
    }
    if (!breakout?.activityId) {
      actions.push(roomActions[1])
    }

    return actions
  }

  console.log(breakout)

  return (
    <div
      style={{
        background: 'linear-gradient(123deg, #EBDFFF 0.31%, #F8F4FF 69.5%)',
      }}
      className="border rounded-xl"
      key={breakout?.name}>
      <div className="flex justify-between items-center gap-4 px-3">
        <EditableLabel
          readOnly={!editable}
          label={breakout?.name || ''}
          className="text-sm line-clamp-1 my-2"
          onUpdate={(value) => {
            if (!editable) return
            // if (frame.content.breakout === value) return

            updateBreakoutRoomName?.(value, idx)
          }}
        />
        <RenderIf isTrue={editable}>
          <DropdownActions
            triggerIcon={
              <Button isIconOnly variant="light" className="-mr-2.5">
                <IoEllipsisVerticalOutline size={20} />
              </Button>
            }
            actions={getActions()}
            onAction={(actionKey) => {
              if (actionKey === 'delete-room') {
                deleteRoomGroup?.(idx)
              }

              if (actionKey === 'delete-room-activity') {
                deleteActivityFrame?.(idx)
              }

              if (actionKey === 'add-activity') {
                onAddNewActivity?.(idx)
              }
            }}
          />
        </RenderIf>
      </div>
      <RenderIf isTrue={!hideActivityCard}>
        <div
          className={cn(
            'border border-gray-100 text-gray-400 m-1 bg-white rounded-xl aspect-video'
          )}>
          <RenderIf isTrue={breakout?.activityId}>
            <div
              ref={thumbnailContainerRef}
              className="relative w-full h-full cursor-pointer"
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
          </RenderIf>
          <RenderIf isTrue={!breakout?.activityId}>
            <div
              className="grid place-items-center h-full w-full cursor-pointer aspect-video"
              onClick={() => {
                if (!editable) return
                onAddNewActivity?.(idx)
              }}>
              <div
                className={cn('grid place-items-center gap-4', {
                  'gap-2': !editable,
                })}>
                {editable ? (
                  <TbAppsFilled size={48} className="text-primary-300" />
                ) : (
                  <PiNoteBlankLight size={48} className="text-gray-200" />
                )}

                <p className="text-xs text-center">
                  {editable ? (
                    <>
                      Click to select a collaborative
                      <br />
                      activity!
                    </>
                  ) : (
                    'No activity!'
                  )}
                </p>
              </div>
            </div>
          </RenderIf>
        </div>
      </RenderIf>
      {!!participants && (
        <div className="flex items-center m-2 pl-2">
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
      {JoinRoomButton}
    </div>
  )
}
