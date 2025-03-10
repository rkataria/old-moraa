import { ReactNode, useState } from 'react'

import data from '@emoji-mart/data/sets/14/apple.json'
import Picker from '@emoji-mart/react'
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/react'

export function EmojiPicker({
  triggerIcon,
  onEmojiSelect,
}: {
  triggerIcon: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEmojiSelect: (selectedEmoji: any) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{ content: 'p-0' }}>
      <PopoverTrigger>{triggerIcon}</PopoverTrigger>
      <PopoverContent>
        <Picker
          data={data}
          set="apple"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onEmojiSelect={(selectedEmojiData: any) => {
            onEmojiSelect(selectedEmojiData)
            setIsOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
