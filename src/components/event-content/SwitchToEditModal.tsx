import { useState } from 'react'

import { Modal, ModalContent, ModalBody, Image } from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button } from '../ui/Button'

import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setIsPreviewOpenAction } from '@/stores/slices/event/current-event/event.slice'
import { KeyboardShortcuts } from '@/utils/utils'

export function SwitchToEditModal() {
  const dispatch = useStoreDispatch()
  const [open, setOpen] = useState(false)
  const isPreview = useStoreSelector(
    (state) => state.event.currentEvent.eventState.isPreviewOpen
  )

  useHotkeys(
    '*',
    (e) => {
      if (
        [
          KeyboardShortcuts['Studio Mode'].notes.key.toLowerCase(),
          KeyboardShortcuts['Studio Mode'].edit.key.toLowerCase(),
          KeyboardShortcuts[
            'Agenda Panel'
          ].expandAndCollapse.key.toLocaleLowerCase(),
          KeyboardShortcuts['Agenda Panel'].grid.key.toLocaleLowerCase(),
          KeyboardShortcuts['Agenda Panel'].list.key.toLocaleLowerCase(),
          'alt',
          'control',
          'ctrl',
          'cmd',
          'meta',
        ].includes(e.key.toLowerCase())
      ) {
        setOpen(false)

        return
      }

      setOpen(true)
    },
    {
      enabled: isPreview || open,
    }
  )

  return (
    <Modal
      hideCloseButton
      size="lg"
      isDismissable
      isOpen={open}
      onClose={() => setOpen(false)}>
      <ModalContent className="rounded-3xl w-[28.175rem]">
        {() => (
          <ModalBody className="m-0 pb-6 rounded-2xl px-0 pt-0">
            <Image src="/images/edit/edit-toggle.svg" width={800} />
            <div className="px-8 grid gap-4">
              <p className="font-semibold text-lg">Switch to Edit Mode</p>
              <p className="text-xs leading-6">
                In Preview Mode, you can only view how your content will
                appear.When you&apos;re ready to make changes, toggle to Edit
                Mode and start typing!
              </p>
              <Button
                color="primary"
                disableAnimation
                size="md"
                onClick={() => {
                  dispatch(setIsPreviewOpenAction(false))
                  setOpen(false)
                }}>
                Press E to Edit
              </Button>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}
