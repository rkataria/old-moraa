/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable array-callback-return */
import { ReactNode } from 'react'

import { Draggable } from 'react-beautiful-dnd'

import { FrameItem } from './FrameItem'
import { ContentType } from '../ContentTypePicker'
import { RenderIf } from '../RenderIf/RenderIf'

import { useEventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type FrameListProps = {
  frames: IFrame[]
  showList: boolean
  droppablePlaceholder: ReactNode
  duplicateFrame: (frame: IFrame) => void
}

export function FrameList({
  frames,
  showList,
  droppablePlaceholder,
  duplicateFrame,
}: FrameListProps) {
  const { leftSidebarVisiblity } = useStudioLayout()
  const { sections } = useEventContext()

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  if (!showList) return null

  const getBreakoutFrames = (frame: IFrame) => {
    if (frame?.type === ContentType.BREAKOUT) {
      const tempFrames = sections.map((sec) => sec.frames).flat(2)
      const breakoutFrames = tempFrames.filter(
        (f) => f?.content?.breakoutFrameId === frame?.id
      )

      return breakoutFrames
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
        frames?.map(
          (frame, frameIndex) =>
            frame && (
              <RenderIf isTrue={!frame?.content?.breakoutFrameId}>
                <div className="flex flex-col">
                  <Draggable
                    key={`frame-draggable-${frame?.id}`}
                    draggableId={`frame-draggable-frameId-${frame?.id}`}
                    index={frameIndex}>
                    {(_provided) => (
                      <div
                        key={frame?.id}
                        ref={_provided.innerRef}
                        {..._provided.draggableProps}
                        {..._provided.dragHandleProps}
                        className="flex w-full">
                        <FrameItem
                          frame={frame}
                          duplicateFrame={duplicateFrame}
                        />
                      </div>
                    )}
                  </Draggable>
                  <RenderIf
                    isTrue={
                      frame?.type === ContentType.BREAKOUT ||
                      Boolean(
                        getBreakoutFrames(frame)
                          ?.map((_frame) => _frame?.id)
                          .includes(frame?.id)
                      )
                    }>
                    <div
                      className={cn('ml-6', {
                        'my-2': getBreakoutFrames(frame)?.length,
                      })}>
                      {getBreakoutFrames(frame)?.map((f) => (
                        <div key={f?.id} className="flex w-full">
                          <FrameItem
                            frame={f}
                            duplicateFrame={duplicateFrame}
                          />
                        </div>
                      ))}
                    </div>
                  </RenderIf>
                </div>
              </RenderIf>
            )
        )}
      {droppablePlaceholder}
    </div>
  )
}
