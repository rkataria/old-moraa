import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react'

import { IFrame } from '@/types/frame.type'

type DeleteBreakoutActivityModalProps = {
  isModalOpen: boolean
  onClose: () => void
  handleDelete: (frame: null | IFrame) => void
  frame: IFrame | null
}

export function DeleteBreakoutRoomModal({
  isModalOpen,
  onClose,
  handleDelete,
  frame,
}: DeleteBreakoutActivityModalProps) {
  return (
    <Modal size="md" isOpen={isModalOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete breakout activity
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure to delete breakout room with
                <span className="font-bold ml-1">{frame?.name}</span> frame?
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
