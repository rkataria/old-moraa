import { useEffect, useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react'

import { Button } from '../ui/Button'

type DuplicateConfirmationModalProps = {
  open: boolean
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  onClose: () => void
  onConfirm: () => void
}

export function DuplicateConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: DuplicateConfirmationModalProps) {
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
              {title || 'Duplicate Confirmation'}
            </ModalHeader>
            <ModalBody>
              {description ||
                'Create new event with all the content inside this event'}
            </ModalBody>
            <ModalFooter>
              <Button size="sm" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                color="primary"
                isLoading={loading}
                onPress={() => {
                  setLoading(true)
                  onConfirm()
                }}>
                Yes, Duplicate
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
