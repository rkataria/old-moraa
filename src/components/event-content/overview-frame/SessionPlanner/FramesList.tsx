import { Fragment, useState } from 'react'

import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { AiOutlineClose } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'

import { FrameItem } from './FrameItem'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { StrictModeDroppable } from '@/components/common/StrictModeDroppable'
import { useEventContext } from '@/contexts/EventContext'
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
  const { insertInSectionId } = useEventContext()
  const { preview, deleteFrames } = useEventContext()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionRunning, setActionRunning] = useState(false)

  const deleteFramesPending = useStoreSelector(
    (state) => state.event.currentEvent.frameState.deleteFramesThunk.isLoading
  )

  const [selectedFrameIds, setSelectedFrameIds] = useState<string[]>([])

  const onChangeAll = (checked: boolean) => {
    setSelectedFrameIds(checked ? section.frames.map((f) => f.id) : [])
  }

  const deleteSelectedFrames = async () => {
    await deleteFrames({
      frameIds: selectedFrameIds,
      sectionId: section.id,
    })
    setActionRunning(true)
    setSelectedFrameIds([])
  }

  return (
    <div>
      <RenderIf isTrue={selectedFrameIds.length > 0}>
        <div className="flex items-center fixed left-[50%] translate-x-[-50%] bg-white w-fit border bottom-10 rounded-lg shadow-2xl h-[64px] overflow-hidden z-[100]">
          <p className="bg-primary text-white h-full aspect-square grid place-items-center text-4xl">
            {selectedFrameIds.length}
          </p>
          <div className="flex items-start gap-8 h-full pl-4">
            <p className="text-xl font-light pt-4 mr-4">Tasks selected</p>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className="grid place-items-center h-full py-2 cursor-pointer"
              onClick={() => {
                setActionRunning(false)
                setShowDeleteModal(true)
              }}>
              <BsTrash size={20} className="hover:text-primary" />
              <p>Delete</p>
            </div>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className="grid place-items-center border-l aspect-square h-full hover:bg-default-50 cursor-pointer rounded-"
              onClick={() => {
                setSelectedFrameIds([])
              }}>
              <AiOutlineClose size={24} />
            </div>
          </div>
        </div>
      </RenderIf>

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
                            setSelectedFrameIds={setSelectedFrameIds}
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
      <Modal
        size="md"
        isOpen={
          showDeleteModal && (deleteFramesPending ? true : !actionRunning)
        }
        onClose={() => setShowDeleteModal(false)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete these frames
              </ModalHeader>
              <ModalBody>
                <p>Are you sure to delete frames</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button
                  isLoading={deleteFramesPending}
                  size="sm"
                  color="primary"
                  onPress={deleteSelectedFrames}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
