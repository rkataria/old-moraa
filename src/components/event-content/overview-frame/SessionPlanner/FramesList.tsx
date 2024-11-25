/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Fragment, useState } from 'react'

import { Checkbox } from '@nextui-org/react'

import { BottomBar } from './BottomBar'
// eslint-disable-next-line import/no-cycle
import { FrameItem } from './FrameItem'
import { NewFramePlaceholder } from './NewFramePlaceholder'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { StrictModeDroppable } from '@/components/common/StrictModeDroppable'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function FramesList({
  sectionId,
  frames = [],
  frameIdToBeFocus,
  placeholder = true,
  className = '',
  parentBreakoutFrame,
}: {
  sectionId: string
  frames: IFrame[]
  frameIdToBeFocus?: string
  placeholder?: boolean
  className?: string
  parentBreakoutFrame?: IFrame | null
}) {
  const {
    insertInSectionId,
    setOpenContentTypePicker,
    setAddedFromSessionPlanner,
    setInsertInSectionId,
    setInsertAfterFrameId,
  } = useEventContext()

  const { preview, eventMode } = useEventContext()

  const { permissions } = useEventPermissions()

  const editable =
    permissions.canUpdateFrame && !preview && eventMode === 'edit'

  const [selectedFrameIds, setSelectedFrameIds] = useState<string[]>([])

  const onChangeAll = (checked: boolean) => {
    setSelectedFrameIds(checked ? frames.map((f) => f.id) : [])
  }

  return (
    <>
      <StrictModeDroppable
        droppableId={`frame-droppable-sectionId-${sectionId}`}
        type="frame">
        {(frameProvided, snapshot) => (
          <div
            key={`frame-draggable-${sectionId}`}
            ref={frameProvided.innerRef}
            className={cn('rounded-sm transition-all w-full', className, {
              'bg-gray-50': snapshot.isDraggingOver,
            })}
            {...frameProvided.droppableProps}>
            <div
              className={cn(
                'w-full relative border border-l-[6px] rounded-xl',
                {
                  'border-primary-100':
                    insertInSectionId === sectionId && !preview,
                }
              )}>
              <div className="w-full">
                <div>
                  <div
                    className={cn('grid  border-b bg-gray-50 rounded-t-xl', {
                      'grid-cols-[40px_100px_120px_1fr_1fr_70px]': editable,
                      'grid-cols-[100px_120px_1fr_1fr_130px]': !editable,
                      'grid-cols-[40px_1fr_1fr_70px]':
                        parentBreakoutFrame && editable,
                      'grid-cols-[1fr_1fr_130px]':
                        parentBreakoutFrame && !editable,
                    })}>
                    <RenderIf isTrue={!preview}>
                      <div className="grid place-items-center border-r">
                        <Checkbox
                          size="md"
                          isSelected={
                            selectedFrameIds.length !== 0 &&
                            selectedFrameIds.length === frames.length
                          }
                          onValueChange={onChangeAll}
                          classNames={{
                            wrapper: 'mr-0 grid',
                            icon: 'text-white',
                          }}
                        />
                      </div>
                    </RenderIf>
                    <RenderIf isTrue={!parentBreakoutFrame}>
                      <p className="p-2 text-center">Duration(m)</p>
                    </RenderIf>
                    <RenderIf isTrue={!parentBreakoutFrame}>
                      <p className="p-2 text-center border-x">Category</p>
                    </RenderIf>

                    <p className="p-2 text-center">
                      {parentBreakoutFrame ? 'Activity' : 'Name'}
                    </p>
                    <p className="border-x p-2 text-center">Notes</p>
                    <p className="p-2 text-center">Status</p>
                  </div>
                  <div className="flex flex-col justify-start items-start w-full transition-all">
                    <RenderIf isTrue={!editable}>
                      {frames.length === 0 && (
                        <p className="text-center w-full py-4">
                          No frames in this section.
                        </p>
                      )}
                    </RenderIf>

                    {frames.map((frame, frameIndex) => (
                      // <RenderIf isTrue={!frame?.content?.breakoutFrameId}>
                      <Fragment key={frame.id}>
                        <FrameItem
                          sectionId={sectionId}
                          frame={frame}
                          frameIndex={frameIndex}
                          frameIdToBeFocus={frameIdToBeFocus}
                          selectedFrameIds={selectedFrameIds}
                          editable={editable}
                          setSelectedFrameIds={setSelectedFrameIds}
                          parentBreakoutFrame={parentBreakoutFrame}
                        />
                      </Fragment>
                      // </RenderIf>
                    ))}
                    <RenderIf isTrue={editable && placeholder}>
                      <div
                        className="w-full cursor-pointer"
                        onClick={() => {
                          setAddedFromSessionPlanner(true)
                          setInsertAfterFrameId(frames[frames.length - 1]?.id)
                          setInsertInSectionId(sectionId)
                          setOpenContentTypePicker(true)
                        }}>
                        <NewFramePlaceholder />
                      </div>
                    </RenderIf>
                  </div>
                  {frameProvided.placeholder}
                </div>
              </div>
            </div>
          </div>
        )}
      </StrictModeDroppable>
      <BottomBar
        sectionId={sectionId}
        frames={frames}
        selectedFrameIds={selectedFrameIds}
        setSelectedFrameIds={setSelectedFrameIds}
        parentBreakoutFrame={parentBreakoutFrame}
      />
    </>
  )
}
