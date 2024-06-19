import { ReactNode } from 'react'

import { Draggable } from 'react-beautiful-dnd'

import { FrameItem } from './FrameItem'

import { useStudioLayout } from '@/hooks/useStudioLayout'
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

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  return (
    <div
      className={cn('flex flex-col gap-1', {
        'p-2 pl-4 pr-0': sidebarExpanded,
        'py-2': !sidebarExpanded,
      })}>
      {showList &&
        frames.map((frame, frameIndex) => (
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
        ))}
      {droppablePlaceholder}
    </div>
  )
}
