/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Modal, ModalContent, ModalHeader } from '@heroui/react'

type StartPresentationModalProps = {
  isOpen: boolean
  onClose: () => void
  onChoose: (key: string) => void
}

const options = [
  {
    label: 'Start from where you left',
    value: 'start-from-where-you-left',
  },
  {
    label: 'Start from beginning',
    value: 'start-from-beginning',
  },
  {
    label: 'Start from selected frame',
    value: 'start-from-selected-frame',
  },
]

export function StartPresentationModal({
  isOpen,
  onClose,
  onChoose,
}: StartPresentationModalProps) {
  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent className="">
        <ModalHeader className="flex flex-col gap-1 bg-primary text-white p-4">
          <h2 className="font-semibold font-md">Start Presentation</h2>
          <p className="text-sm font-normal">
            Choose an option to start the presentation
          </p>
        </ModalHeader>
        <div className="grid grid-cols-3 gap-4 place-content-center p-8">
          {options.map((option) => (
            <div
              key={option.value}
              className="aspect-video bg-gray-200 hover:bg-primary-100 transition-all duration-300 rounded-md flex justify-center items-center cursor-pointer"
              onClick={() => onChoose(option.value)}>
              {option.label}
            </div>
          ))}
        </div>
      </ModalContent>
    </Modal>
  )
}
