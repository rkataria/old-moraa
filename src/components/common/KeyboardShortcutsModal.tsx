import { useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Kbd,
  Divider,
  KbdKey,
} from '@heroui/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Loading } from './Loading'
import { RenderIf } from './RenderIf/RenderIf'

import type { UseDisclosureReturn } from '@heroui/use-disclosure'

import { useProfile } from '@/hooks/useProfile'
import { UserType } from '@/types/common'
import { KeyboardShortcuts as creatorShorcuts } from '@/utils/utils'

export function KeyboardShortcutsModal({
  disclosure,
  withoutModal = false,
}: {
  withoutModal?: boolean
  disclosure?: UseDisclosureReturn
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: profile, isLoading } = useProfile()

  useHotkeys('shift + slash', () => setIsOpen(true), [])

  const closeModal = () => {
    setIsOpen(false)
    disclosure?.onClose()
  }

  if (isLoading || !profile) return <Loading />

  const learnerShortcuts = {
    'Agenda Panel': Object.fromEntries(
      Object.entries(creatorShorcuts['Agenda Panel']).filter(
        ([key]) => key !== 'expandAndCollapse'
      )
    ),
    Live: creatorShorcuts.Live,
  }

  const shortcuts =
    profile.user_type === UserType.EDUCATOR ? creatorShorcuts : learnerShortcuts

  const keyboardListing = () =>
    Object.entries(shortcuts).map(([section, actions], index) => (
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
        <RenderIf isTrue={index !== Object.entries(shortcuts).length - 1}>
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
      classNames={{ wrapper: 'justify-end scrollbar-none' }}
      className="max-h-[96vh] shadow-2xl"
      scrollBehavior="inside"
      backdrop="transparent">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <p>Help</p>
            </ModalHeader>
            <ModalBody>
              <p className="text-lg font-medium">Keyboard Shortcuts</p>
              <div className="max-h-[90vh] pb-2 overflow-y-scroll scrollbar-none">
                {keyboardListing()}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
