import { Fragment, useState } from 'react'

import { Button, Checkbox } from '@nextui-org/react'
import { MdFormatListBulletedAdd, MdAdd } from 'react-icons/md'

import { BottomBar } from './BottomBar'
import { FrameItem } from './FrameItem'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { StrictModeDroppable } from '@/components/common/StrictModeDroppable'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { ISection } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function FramesList({
  section,
  frameIdToBeFocus,
}: {
  section: ISection
  frameIdToBeFocus: string
}) {
  const {
    insertInSectionId,
    addSection,
    setOpenContentTypePicker,
    setAddedFromSessionPlanner,
    setInsertInSectionId,
    setInsertAfterSectionId,
  } = useEventContext()

  const isAddFrameLoading = useStoreSelector(
    (state) => state.event.currentEvent.frameState.addFrameThunk.isLoading
  )

  const isAddSectionLoading = useStoreSelector(
    (state) =>
      state.event.currentEvent.sectionState.createSectionThunk.isLoading
  )

  const { preview, eventMode } = useEventContext()

  const { permissions } = useEventPermissions()

  const editable =
    permissions.canUpdateFrame && !preview && eventMode === 'edit'

  const [selectedFrameIds, setSelectedFrameIds] = useState<string[]>([])

  const onChangeAll = (checked: boolean) => {
    setSelectedFrameIds(checked ? section.frames.map((f) => f.id) : [])
  }

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
            <div
              className={cn(
                'w-full relative border border-l-[6px] rounded-xl',
                {
                  'border-primary-100':
                    insertInSectionId === section.id && !preview,
                }
              )}>
              <div className="w-full">
                <div>
                  <div
                    className={cn(
                      'grid grid-cols-[100px_12px_1fr_1fr_130px] border-b bg-gray-50 rounded-t-xl',
                      {
                        'grid-cols-[40px_100px_12px_1fr_1fr_70px]': !preview,
                      }
                    )}>
                    <RenderIf isTrue={!preview}>
                      <div className="grid place-items-center border-r">
                        <Checkbox
                          size="md"
                          isSelected={
                            selectedFrameIds.length !== 0 &&
                            selectedFrameIds.length === section.frames.length
                          }
                          onValueChange={onChangeAll}
                          classNames={{
                            wrapper: 'mr-0 grid',
                            icon: 'text-white',
                          }}
                        />
                      </div>
                    </RenderIf>

                    <p className="p-2 text-center">Duration</p>
                    <p className="border-r" />
                    <p className="p-2 text-center">Name</p>

                    <p className="border-x p-2 text-center">Notes</p>

                    <p className="p-2 text-center">Status</p>
                  </div>
                  <div className="flex flex-col justify-start items-start w-full transition-all">
                    {section.frames.length === 0 && (
                      <p className="text-center w-full py-4">
                        No frames in this section.
                      </p>
                    )}
                    {section.frames.map((frame, frameIndex) => (
                      <RenderIf isTrue={!frame?.content?.breakoutFrameId}>
                        <Fragment key={frame.id}>
                          <FrameItem
                            section={section}
                            frame={frame}
                            frameIndex={frameIndex}
                            frameIdToBeFocus={frameIdToBeFocus}
                            selectedFrameIds={selectedFrameIds}
                            editable={editable}
                            setSelectedFrameIds={setSelectedFrameIds}
                          />
                        </Fragment>
                      </RenderIf>
                    ))}
                    <RenderIf isTrue={editable}>
                      <div className="flex items-center p-1 opacity-30">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            color="default"
                            variant="light"
                            isLoading={
                              isAddFrameLoading &&
                              insertInSectionId === section.id
                            }
                            className="pl-1 gap-2"
                            startContent={<MdAdd size={24} />}
                            onClick={() => {
                              setInsertInSectionId(section.id)
                              setAddedFromSessionPlanner(true)
                              setOpenContentTypePicker(true)
                            }}>
                            Add Frame
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            isLoading={
                              isAddSectionLoading &&
                              insertInSectionId === section.id
                            }
                            startContent={<MdFormatListBulletedAdd size={22} />}
                            onClick={() => {
                              setInsertInSectionId(section.id)
                              setInsertAfterSectionId(section.id)
                              addSection({
                                afterSectionId: section.id,
                              })
                            }}>
                            Add Section
                          </Button>
                        </div>
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
        section={section}
        selectedFrameIds={selectedFrameIds}
        setSelectedFrameIds={setSelectedFrameIds}
      />
    </div>
  )
}
