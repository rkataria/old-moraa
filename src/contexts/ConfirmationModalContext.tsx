import { createContext, useState, useRef, ReactNode } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react'

type ModalState = {
  isOpen: boolean
  title?: string
  content?: string
}

type ModalContextType = {
  openModal: (params: { title: string; content: string }) => Promise<void>
}

export const ConfirmationModalContext = createContext<ModalContextType | null>(
  null
)

type ConfirmationModalProviderProps = {
  children: ReactNode
}

export function ConfirmationModalProvider({
  children,
}: ConfirmationModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false })
  // eslint-disable-next-line no-spaced-func
  const promiseRef = useRef<{
    // eslint-disable-next-line func-call-spacing
    resolve: () => void
    reject: () => void
  } | null>(null)

  const openModal = ({ title, content }: { title: string; content: string }) =>
    new Promise<void>((resolve, reject) => {
      setModalState({
        isOpen: true,
        title,
        content,
      })
      promiseRef.current = { resolve, reject }
    })

  const closeModal = () => {
    setModalState({ isOpen: false })
  }

  const handleConfirm = () => {
    if (promiseRef.current) {
      promiseRef.current.resolve()
    }
    closeModal()
  }

  const handleCancel = () => {
    if (promiseRef.current) {
      promiseRef.current.reject()
    }
    closeModal()
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ConfirmationModalContext.Provider value={{ openModal }}>
      {children}
      <Modal size="md" isOpen={modalState.isOpen} onClose={handleCancel}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>{modalState.title}</ModalHeader>
              <ModalBody>
                <p>{modalState.content}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" color="primary" onPress={handleConfirm}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </ConfirmationModalContext.Provider>
  )
}
