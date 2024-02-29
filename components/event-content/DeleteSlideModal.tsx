"use client"
import { ISlide } from "@/types/slide.type"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react"

import { Button } from "@nextui-org/react"

type DeleteSlideModalProps = {
  isModalOpen: boolean
  onClose: any
  handleDelete: any
  slide: ISlide
}

export const DeleteSlideModal = ({
  isModalOpen,
  onClose,
  handleDelete,
  slide,
}: DeleteSlideModalProps) => {
  return (
    <Modal
      size="md"
      isOpen={isModalOpen}
      onClose={onClose}
      onOpenChange={handleDelete}
    >
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
