import { Fragment, useContext } from 'react'

import { FrameItem } from './FrameItem'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { StrictModeDroppable } from '@/components/common/StrictModeDroppable'
import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { ISection } from '@/types/frame.type'
import { getFilteredFramesByStatus } from '@/utils/event.util'
import { cn } from '@/utils/utils'

export function FramesList({ section }: { section: ISection }) {
  const { isOwner, preview, eventMode } = useContext(
    EventContext
  ) as EventContextType

  const editable = isOwner && !preview && eventMode === 'edit'

  return (
    <div className="m">
      <StrictModeDroppable
        droppableId={`frame-droppable-sectionId-${section?.id}`}
        type="frame">
        {(frameProvided, snapshot) => (
          <div
            key={`frame-draggable-${section.id}`}
            ref={frameProvided.innerRef}
            className={cn('rounded-sm transition-all w-full', {
              'bg-gray-50': snapshot.isDraggingOver,
              // 'cursor-grab': !actionDisabled,
            })}
            {...frameProvided.droppableProps}>
            <div className="w-full relative">
              <div className="w-full">
                <div>
                  <div className="flex flex-col justify-start items-start gap-[1.5px] w-full rounded-sm transition-all">
                    {getFilteredFramesByStatus({
                      frames: section.frames,
                      status: editable ? null : FrameStatus.PUBLISHED,
                    }).map((frame, frameIndex) => (
                      <RenderIf isTrue={!frame?.content?.breakoutFrameId}>
                        <Fragment key={frame.id}>
                          <FrameItem
                            section={section}
                            frame={frame}
                            frameIndex={frameIndex}
                          />
                        </Fragment>
                      </RenderIf>
                    ))}
                  </div>
                  {frameProvided.placeholder}
                </div>
              </div>
            </div>
          </div>
        )}
      </StrictModeDroppable>
    </div>
  )
}
