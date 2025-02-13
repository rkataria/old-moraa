/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Dispatch, SetStateAction, useState } from 'react'

import { Button } from '@nextui-org/button'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { AiOutlineClose } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'
import { IoDuplicateOutline } from 'react-icons/io5'
import { MdOutlineUnpublished } from 'react-icons/md'
import { RiShare2Line } from 'react-icons/ri'
import { v4 as uuidv4 } from 'uuid'

import { CategoryChange } from './CategoryChange'
import { MoveToSection } from './MoveTo'

import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  bulkUpdateFramesThunk,
  createFramesThunk,
} from '@/stores/thunks/frame.thunks'
import { FrameStatus } from '@/types/enums'
import { IFrame } from '@/types/frame.type'

interface IBottomBar {
  selectedFrameIds: string[]
  sectionId: string
  frames: IFrame[]
  parentBreakoutFrame?: IFrame | null
  setSelectedFrameIds: Dispatch<SetStateAction<string[]>>
}

export function BottomBar({
  selectedFrameIds,
  sectionId,
  frames = [],
  parentBreakoutFrame,
  setSelectedFrameIds,
}: IBottomBar) {
  const { deleteFrames, updateFrame } = useEventContext()
  const dispatch = useStoreDispatch()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionRunning, setActionRunning] = useState(false)

  const deleteFramesPending = useStoreSelector(
    (state) => state.event.currentEvent.frameState.deleteFramesThunk.isLoading
  )

  const handleBreakoutActivityFrameDelete = (breakoutFrame: IFrame | null) => {
    if (!breakoutFrame) return
    let payload = {}
    if (breakoutFrame.config.breakoutType === BREAKOUT_TYPES.ROOMS) {
      payload = {
        content: {
          ...breakoutFrame.content,
          breakoutRooms:
            breakoutFrame.content?.breakoutRooms?.map((activity) =>
              selectedFrameIds.includes(activity.activityId || '')
                ? { ...activity, activityId: null }
                : activity
            ) || [],
        },
      }
    } else {
      payload = {
        content: {
          ...breakoutFrame.content,
          groupActivityId: null,
        },
      }
    }

    updateFrame({ framePayload: payload, frameId: breakoutFrame.id })
  }

  const deleteSelectedFrames = async () => {
    await deleteFrames({
      frameIds: selectedFrameIds,
      sectionId,
    })

    if (parentBreakoutFrame) {
      handleBreakoutActivityFrameDelete(parentBreakoutFrame)
    }

    setActionRunning(true)
    setSelectedFrameIds([])
  }

  const changeFramesStatus = (status: FrameStatus) => {
    setActionRunning(false)

    // Filter frames that have a valid content type
    const validFrames = frames
      .filter((frame) => selectedFrameIds.includes(frame.id) && frame.type)
      .map((frame) => frame.id)

    dispatch(
      bulkUpdateFramesThunk({
        frameIds: validFrames,
        payload: {
          status,
        },
      })
    )

    toast.success(
      status === FrameStatus.PUBLISHED
        ? 'Selected frames have been shared with learners.'
        : 'Selected frames have been removed from learners view'
    )
    setSelectedFrameIds([])
  }

  const onDuplicate = async () => {
    const selectedFramesWithContent = frames.filter((f) =>
      selectedFrameIds.includes(f.id)
    )
    const duplicatedFramesPayload = selectedFramesWithContent.map((f) => ({
      ...f,
      id: uuidv4(),
    }))

    dispatch(
      createFramesThunk({
        sectionId,
        frames: duplicatedFramesPayload,
        insertAfterFrameId:
          selectedFramesWithContent[selectedFramesWithContent.length - 1].id,
      })
    )

    setSelectedFrameIds([])
  }

  if (selectedFrameIds.length === 0) return null

  return (
    <>
      <motion.div
        initial={{ y: '6px', opacity: 0, x: '-50%' }}
        animate={{ y: '0%', opacity: 1, x: '-50%' }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        className="flex items-center fixed left-[50%] bg-white w-fit border bottom-10 rounded-lg shadow-2xl w-max h-[64px] overflow-hidden z-[100]">
        <p className="bg-primary text-white h-full aspect-square grid place-items-center text-4xl">
          {selectedFrameIds.length}
        </p>
        <div className="flex items-start gap-8 h-full pl-4">
          <p className="text-xl font-light pt-4 mr-4 min-w-fit">
            Frames selected
          </p>
          <RenderIf isTrue={!parentBreakoutFrame}>
            <div
              className="grid place-items-center h-full py-2 cursor-pointer gap-1"
              onClick={onDuplicate}>
              <IoDuplicateOutline size={22} className="hover:text-primary" />
              <p className="text-xs">Duplicate</p>
            </div>
          </RenderIf>

          <div
            className="grid place-items-center h-full py-2 cursor-pointer gap-1"
            onClick={() => {
              setActionRunning(false)
              setShowDeleteModal(true)
            }}>
            <BsTrash size={20} className="hover:text-primary" />
            <p className="text-xs">Delete</p>
          </div>
          <div
            className="grid place-items-center h-full py-2 cursor-pointer gap-1"
            onClick={() => changeFramesStatus(FrameStatus.PUBLISHED)}>
            <RiShare2Line size={22} className="hover:text-primary" />
            <p className="text-xs">Share</p>
          </div>
          <div
            className="grid place-items-center h-full py-2 cursor-pointer gap-1"
            onClick={() => changeFramesStatus(FrameStatus.DRAFT)}>
            <MdOutlineUnpublished size={22} className="hover:text-primary" />
            <p className="text-xs">Unshare</p>
          </div>

          <CategoryChange
            selectedFrameIds={selectedFrameIds}
            setSelectedFrameIds={setSelectedFrameIds}
          />

          <MoveToSection
            selectedFrameIds={selectedFrameIds}
            setSelectedFrameIds={setSelectedFrameIds}
          />

          <div
            className="grid place-items-center border-l aspect-square h-full hover:bg-default-50 cursor-pointer rounded-"
            onClick={() => {
              setSelectedFrameIds([])
            }}>
            <AiOutlineClose size={24} />
          </div>
        </div>
      </motion.div>
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
    </>
  )
}
