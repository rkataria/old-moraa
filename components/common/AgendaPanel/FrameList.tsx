import { ReactNode } from 'react'

import { Draggable } from 'react-beautiful-dnd'

import { FrameItem } from './FrameItem'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type FrameListProps = {
  frames: IFrame[]
  droppablePlaceholder: ReactNode
}

export function FrameList({ frames, droppablePlaceholder }: FrameListProps) {
  const { leftSidebarVisiblity } = useStudioLayout()

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  return (
    <div
      className={cn('flex flex-col gap-2', {
        'p-2 pl-4 pr-0': sidebarExpanded,
        'py-2': !sidebarExpanded,
      })}>
      {frames.map((frame, frameIndex) => (
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
              className="mt-2 flex w-full">
              <FrameItem frame={frame} />
            </div>
          )}
        </Draggable>
      ))}
      {droppablePlaceholder}
    </div>
  )
}
