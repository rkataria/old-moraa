/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable array-callback-return */
import { ReactNode, useContext } from 'react'

import { Draggable } from 'react-beautiful-dnd'

import { FrameItem } from './FrameItem'
import { ContentType } from '../ContentTypePicker'
import { RenderIf } from '../RenderIf/RenderIf'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type FrameListProps = {
  frames: IFrame[]
  showList: boolean
  droppablePlaceholder: ReactNode
}

export function FrameList({
  frames,
  showList,
  droppablePlaceholder,
}: FrameListProps) {
  const { leftSidebarVisiblity } = useStudioLayout()
  const { sections, currentFrame } = useContext(
    EventContext
  ) as EventContextType

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  let lastSelectedBreakoutId = ''
  if (currentFrame && currentFrame.type === ContentType.BREAKOUT) {
    lastSelectedBreakoutId = currentFrame?.id
  }

  if (!showList) return null

  const getBreakoutFrames = (frame: IFrame) => {
    if (frame.type === ContentType.BREAKOUT) {
      const tempFrames = sections.map((sec) => sec.frames).flat(2)
      const breakoutFrames = tempFrames.filter(
        (f) => f?.content?.breakoutFrameId === frame.id
      )

      return breakoutFrames?.map((f) => (
        <div key={f.id} className="flex w-full">
          <FrameItem frame={f} />
        </div>
      ))
    }

    return null
  }

  return (
    <div
      className={cn('flex flex-col gap-1', {
        'p-2 pl-6 pr-0': sidebarExpanded,
        'py-2': !sidebarExpanded,
      })}>
      {showList &&
        frames.map((frame, frameIndex) => (
          <RenderIf isTrue={!frame?.content?.breakoutFrameId}>
            <div className="flex flex-col">
              <Draggable
                key={`frame-draggable-${frame.id}`}
                draggableId={`frame-draggable-frameId-${frame.id}`}
                index={frameIndex}>
                {(_provided) => (
                  <div
                    key={frame.id}
                    ref={_provided.innerRef}
                    {..._provided.draggableProps}
                    {..._provided.dragHandleProps}
                    className="flex w-full">
                    <FrameItem frame={frame} />
                  </div>
                )}
              </Draggable>
              <RenderIf
                isTrue={
                  (frame.type === ContentType.BREAKOUT &&
                    currentFrame?.id === frame.id) ||
                  lastSelectedBreakoutId === frame?.content?.breakoutFrameId
                }>
                <div className="ml-6">{getBreakoutFrames(frame)}</div>
              </RenderIf>
            </div>
          </RenderIf>
        ))}
      {droppablePlaceholder}
    </div>
  )
}
