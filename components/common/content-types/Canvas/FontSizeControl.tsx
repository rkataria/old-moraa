import { useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { Button, ButtonGroup } from '@nextui-org/react'

import { cn } from '@/utils/utils'

type FontSizeControlProps = {
  size?: number
  onFontSizeChange: (size: number) => void
  isDisabled?: boolean
  isTime?: boolean
}

export function FontSizeControl({
  size = 16,
  onFontSizeChange,
  isDisabled = false,
  isTime = false,
}: FontSizeControlProps) {
  const [fontSize, setFontSize] = useState<number>(size)

  const updateByNumber = isTime ? 15 : 1

  // hotkeys
  useHotkeys('-', () => {
    handleFontSizeChange(fontSize - updateByNumber)
  })
  useHotkeys('-', () => {
    handleFontSizeChange(fontSize + updateByNumber)
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
        onClick={() => handleFontSizeChange(fontSize - updateByNumber)}>
        -
      </Button>
      <input
        className={cn(
          'h-8 text-sm text-center border-y-2 border-gray-100 bg-white flex-none',
          {
            'bg-gray-200': isDisabled,
            'w-8': !isTime,
            'w-14': isTime,
          }
        )}
        value={`${fontSize}${isTime ? ' min' : ''}`}
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
        onClick={() => handleFontSizeChange(fontSize + updateByNumber)}>
        +
      </Button>
    </ButtonGroup>
  )
}
