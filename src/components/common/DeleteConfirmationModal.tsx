import { useEffect, useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react'

type DeleteConfirmationModalProps = {
  open: boolean
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(!open)
  }, [open])

  return (
    <Modal size="md" isOpen={open} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title || 'Delete Confirmation'}
            </ModalHeader>
            <ModalBody>{description || 'Are you sure to delete?'}</ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={loading}
                onPress={() => {
                  setLoading(true)
                  onConfirm()
                }}>
                Yes, Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
