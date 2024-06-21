import { useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { Button, ButtonGroup } from '@nextui-org/react'

import { cn } from '@/utils/utils'

type FontSizeControlProps = {
  size?: number
  onFontSizeChange: (size: number) => void
  isDisabled?: boolean
}

export function FontSizeControl({
  size = 16,
  onFontSizeChange,
  isDisabled = false,
}: FontSizeControlProps) {
  const [fontSize, setFontSize] = useState<number>(size)

  // hotkeys
  useHotkeys('-', () => {
    handleFontSizeChange(fontSize - 1)
  })
  useHotkeys('-', () => {
    handleFontSizeChange(fontSize + 1)
  })

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
    onFontSizeChange(newSize)
  }

  return (
    <ButtonGroup radius="md">
      <Button
        size="sm"
        variant="flat"
        className={cn('flex-none', {
          'bg-gray-200': isDisabled,
          'bg-gray-300': !isDisabled,
        })}
        disabled={isDisabled}
        onClick={() => handleFontSizeChange(fontSize - 1)}>
        -
      </Button>
      <input
        className={cn(
          'w-8 h-8 text-sm text-center border-y-2 border-gray-100 bg-white flex-none',
          {
            'bg-gray-200': isDisabled,
          }
        )}
        value={fontSize}
        disabled={isDisabled}
        onChange={(e) => handleFontSizeChange(+e.target.value)}
      />
      <Button
        size="sm"
        variant="flat"
        disabled={isDisabled}
        className={cn('flex-none', {
          'bg-gray-200': isDisabled,
          'bg-gray-300': !isDisabled,
        })}
        onClick={() => handleFontSizeChange(fontSize + 1)}>
        +
      </Button>
    </ButtonGroup>
  )
}
