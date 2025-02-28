import { Switch } from '@heroui/react'
import { useSelf, useUpdateMyPresence } from '@liveblocks/react'

import { LabelWithInlineControl } from '../LabelWithInlineControl'

export function HideMyCursor() {
  const self = useSelf()
  const updateMyPresence = useUpdateMyPresence()

  const handleToggleCursor = (isHidden: boolean) => {
    updateMyPresence({ hideCursor: isHidden })
  }

  return (
    <div className="p-2 bg-gray-50 rounded-md mb-2">
      <LabelWithInlineControl
        label="Hide my cursor"
        classNames={{
          label: '!text-small',
        }}
        control={
          <Switch
            key={`key-${self?.presence.hideCursor}`}
            size="sm"
            isSelected={self?.presence.hideCursor}
            onValueChange={handleToggleCursor}
          />
        }
      />
    </div>
  )
}
