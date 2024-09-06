import { useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Kbd,
  Divider,
  KbdKey,
} from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { RenderIf } from './RenderIf/RenderIf'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'

import { KeyboardShortcuts } from '@/utils/utils'

export function KeyboardShortcutsModal({
  disclosure,
  withoutModal = false,
}: {
  withoutModal?: boolean
  disclosure?: UseDisclosureReturn
}) {
  const [isOpen, setIsOpen] = useState(false)

  useHotkeys('mod + /', () => setIsOpen(true), [])

  const closeModal = () => {
    setIsOpen(false)
    disclosure?.onClose()
  }

  const keyboardListing = () =>
    Object.entries(KeyboardShortcuts).map(([section, actions], index) => (
      <div key={section}>
        <p className="text-gray-800 text-sm font-medium">{section}</p>
        <div className="mt-2 grid gap-3">
          {Object.entries(actions).map(([action, details]) => {
            const keysArray = details.key.split(' + ')

            return (
              <div key={action} className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">{details.label}</p>
                <div className="flex items-center gap-2">
                  {keysArray.map((key) => (
                    <Kbd
                      keys={key === 'alt' ? 'option' : (key as KbdKey)}
                      classNames={{
                        base: 'bg-gray-700 text-white rounded-[4px]',
                      }}>
                      {key === 'alt' ? 'Opt' : key}
                    </Kbd>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <RenderIf
          isTrue={index !== Object.entries(KeyboardShortcuts).length - 1}>
          <Divider className="my-4" />
        </RenderIf>
      </div>
    ))

  if (withoutModal) {
    return keyboardListing()
  }

  return (
    <Modal
      isOpen={isOpen || disclosure?.isOpen}
      onClose={closeModal}
      classNames={{ wrapper: 'justify-end scrollbar-none' }}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <p>Help</p>
            </ModalHeader>
            <ModalBody>
              <p className="text-lg font-medium">Keyboard Shortcuts</p>
              <div className="max-h-[90vh] overflow-y-scroll scrollbar-none">
                {keyboardListing()}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
