'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react'

import { ISlide } from '@/types/slide.type'

type DeleteSlideModalProps = {
  isModalOpen: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDelete: any
  slide: ISlide
}

export function DeleteSlideModal({
  isModalOpen,
  onClose,
  handleDelete,
  slide,
}: DeleteSlideModalProps) {
  return (
    <Modal
      size="md"
      isOpen={isModalOpen}
      onClose={onClose}
      onOpenChange={handleDelete}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete slide
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure to delete slide
                <span className="font-bold ml-1">{slide.name}</span> ?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={() => handleDelete(slide)}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
