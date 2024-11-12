import { useState } from 'react'

import { Button } from '@nextui-org/button'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@nextui-org/react'

import { ControlButton } from '../ControlButton'

import { cn } from '@/utils/utils'

export function EndBreakoutButton({
  onEndBreakoutClick,
}: {
  onEndBreakoutClick: () => void
}) {
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <ControlButton
        tooltipProps={{
          content: 'End planned breakout',
        }}
        buttonProps={{
          size: 'sm',
          variant: 'solid',
          className: cn(
            'gap-2 justify-between live-button !text-white !bg-red-500 hover:!bg-red-500'
          ),
        }}
        onClick={() => setOpen(true)}>
        End planned breakout
      </ControlButton>
      <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to end the breakout session?
              </ModalHeader>

              <ModalFooter>
                <Button variant="light" size="sm" onPress={onClose}>
                  Keep going
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onPress={() => {
                    setOpen(false)
                    onEndBreakoutClick?.()
                  }}>
                  End breakout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
