/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useRef } from 'react'

import { Button } from '@nextui-org/button'
import { IoCheckmarkCircle } from 'react-icons/io5'

import { ContextMenu } from './ContextMenu'
import { FrameThumbnailCard } from './FrameThumbnailCard'
import { frameActions } from '../FrameActions'
import { RenderIf } from '../RenderIf/RenderIf'
import { Tooltip } from '../ShortuctTooltip'

import { useDimensions } from '@/hooks/useDimensions'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useOnScreen } from '@/hooks/useOnScreen'
import { useStoreSelector } from '@/hooks/useRedux'
import { FrameStatus } from '@/types/enums'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function FrameGridView({
  frame,
  handleFrameAction,
  sidebarExpanded,
  frameActive,
  onClick,
}: {
  frame: IFrame
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFrameAction: (item: any) => void
  sidebarExpanded: boolean
  frameActive: boolean
  onClick: (frame: IFrame) => void
}) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const breakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.breakoutFrameId
  )

  const { permissions } = useEventPermissions()

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    sidebarExpanded
  )

  const isVisible = useOnScreen(thumbnailContainerRef)

  return (
    <ContextMenu items={frameActions} handleActions={handleFrameAction}>
      <div
        key={`frame-${frame?.id}`}
        data-miniframe-id={frame?.id}
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-lg group/frame-item',
          {
            'border-primary border-2': frameActive,
            'border-transparent border-2': !frameActive,
          }
        )}
        onClick={() => {
          onClick(frame)
        }}>
        {breakoutFrameId === frame?.id ? (
          <div className="absolute top-0 right-0 p-1 bg-primary text-white rounded-bl-md rounded-tr-md">
            <p className="text-xs">In Breakout</p>
          </div>
        ) : null}

        <div
          className={cn(
            'relative flex flex-col transition-all duration-400 ease-in-out '
          )}>
          <div
            className={cn(
              'w-full rounded-lg border border-gray-300 overflow-hidden aspect-video bg-gray-100'
            )}>
            <RenderIf
              isTrue={
                frame.status === FrameStatus.PUBLISHED &&
                permissions.canUpdateFrame
              }>
              <Tooltip label="Published">
                <Button
                  isIconOnly
                  className="absolute top-0 right-0 z-[99] m-1.5 w-auto h-auto min-w-[auto] rounded-full bg-transparent border-none">
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
                inViewPort={isVisible}
              />
            </div>
          </div>
        </div>
      </div>
    </ContextMenu>
  )
}
