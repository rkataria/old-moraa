import { useEffect, useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'

import { Button } from '../ui/Button'

type ConfirmationModalProps = {
  open: boolean
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  confirmButtonLabel?: React.ReactNode
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmationModal({
  open,
  title,
  description,
  confirmButtonLabel = 'Yes, Delete',
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
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
              <Button size="sm" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                color="danger"
                isLoading={loading}
                onPress={() => {
                  setLoading(true)
                  onConfirm()
                }}>
                {confirmButtonLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
