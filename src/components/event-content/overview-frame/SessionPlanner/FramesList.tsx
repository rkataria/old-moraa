import { Fragment } from 'react'

import { FrameItem } from './FrameItem'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { StrictModeDroppable } from '@/components/common/StrictModeDroppable'
import { ISection } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function FramesList({
  section,
  plannerWidth,
}: {
  section: ISection
  plannerWidth: number
}) {
  return (
    <div>
      <StrictModeDroppable
        droppableId={`frame-droppable-sectionId-${section?.id}`}
        type="frame">
        {(frameProvided, snapshot) => (
          <div
            key={`frame-draggable-${section.id}`}
            ref={frameProvided.innerRef}
            className={cn('rounded-sm transition-all w-full', {
              'bg-gray-50': snapshot.isDraggingOver,
            })}
            {...frameProvided.droppableProps}>
            <div className="w-full relative">
              <div className="w-full">
                <div>
                  <div className="flex flex-col justify-start items-start gap-[4px] pt-2 w-full bg-primary/5 transition-all">
                    {section.frames.map((frame, frameIndex) => (
                      <RenderIf isTrue={!frame?.content?.breakoutFrameId}>
                        <Fragment key={frame.id}>
                          <FrameItem
                            section={section}
                            frame={frame}
                            frameIndex={frameIndex}
                            plannerWidth={plannerWidth}
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
