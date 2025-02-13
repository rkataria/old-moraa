/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { MouseEvent, useRef } from 'react'

import { Button } from '@nextui-org/button'
import { IoCheckmarkCircle } from 'react-icons/io5'

import { ActiveBreakoutIndicator } from './ActiveBreakoutIndicator'
import { ContextMenu } from './ContextMenu'
import { FrameThumbnailCard } from './FrameThumbnailCard'
import { frameActions } from '../FrameActions'
import { RenderIf } from '../RenderIf/RenderIf'
import { Tooltip } from '../ShortuctTooltip'

import { useEventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { FrameStatus } from '@/types/enums'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function FrameGridView({
  frame,
  sidebarExpanded,
  frameActive,
  framePosition,
  onClick,
  handleFrameAction,
}: {
  frame: IFrame
  sidebarExpanded: boolean
  frameActive: boolean
  framePosition?: number
  onClick: (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    frame: IFrame
  ) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFrameAction: (item: any) => void
}) {
  const { preview } = useEventContext()
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const breakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId
  )
  const isBreakoutActive = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isBreakoutActive
  )

  const { permissions } = useEventPermissions()

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    sidebarExpanded
  )

  const breakoutRunning = isBreakoutActive && breakoutFrameId === frame.id

  return (
    <ContextMenu
      items={frameActions.filter(
        (action) => !action.disableForFrames?.includes(frame.type)
      )}
      listBoxProps={{
        disabledKeys: !frame.type ? ['save-frame-in-library'] : [],
      }}
      handleActions={handleFrameAction}
      disabled={!permissions.canUpdateFrame || preview}
      className={cn('flex items-start gap-2 p-0.5 pl-2 rounded-lg', {
        'bg-primary/10': frameActive,
      })}>
      <RenderIf isTrue={!!framePosition}>
        <p className="text-xs text-black/60 mt-1">{framePosition}</p>
      </RenderIf>

      <div
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-md group/frame-item w-full',
          {
            'border-primary border-1': frameActive,
            'border-gray-200 border-1': !frameActive,
            'border border-green-400': breakoutRunning,
          }
        )}
        onClick={(e) => {
          onClick(e, frame)
        }}>
        <RenderIf isTrue={breakoutRunning}>
          <ActiveBreakoutIndicator />
        </RenderIf>

        <div
          className={cn(
            'relative flex flex-col transition-all duration-400 ease-in-out '
          )}>
          <div
            className={cn(
              'w-full rounded-md overflow-hidden aspect-video bg-white'
            )}>
            <RenderIf
              isTrue={
                frame.status === FrameStatus.PUBLISHED &&
                permissions.canUpdateFrame
              }>
              <Tooltip label="Published">
                <Button
                  isIconOnly
                  className="absolute top-0 right-0 z-[10] m-1.5 w-auto h-auto min-w-[auto] rounded-full bg-transparent border-none">
                  <IoCheckmarkCircle
                    className=" rounded-full text-green-500 shadow-[0_0_10px_-4px] bg-white"
                    size={18}
                  />
                </Button>
              </Tooltip>
            </RenderIf>

            <div ref={thumbnailContainerRef} className="relative w-full h-full">
              <FrameThumbnailCard
                frame={frame}
                containerWidth={containerWidth}
              />
            </div>
          </div>
        </div>
      </div>
    </ContextMenu>
  )
}
