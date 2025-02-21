import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'

import { Button } from '../ui/Button'

import { IFrame } from '@/types/frame.type'

type DeleteFrameModalProps = {
  isModalOpen: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDelete: any
  frame: IFrame | null
}

export function DeleteFrameModal({
  isModalOpen,
  onClose,
  handleDelete,
  frame,
}: DeleteFrameModalProps) {
  return (
    <Modal size="md" isOpen={isModalOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete frame
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure to delete frame
                <span className="font-bold ml-1">{frame?.name}</span>?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                color="primary"
                onPress={() => handleDelete(frame)}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
