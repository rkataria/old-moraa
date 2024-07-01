import { useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { Button, ButtonGroup } from '@nextui-org/react'

import { cn } from '@/utils/utils'

type FontSizeControlProps = {
  defaultCount?: number
  onCountChange: (size: number) => void
  isDisabled?: boolean
  incrementStep?: number
  postfixLabel?: string
  fullWidth?: boolean
}

// TODO: Fix this component types whenever this is used.
export function TwoWayNumberCounter({
  defaultCount = 16,
  onCountChange: onFontSizeChange,
  isDisabled = false,
  incrementStep = 1,
  postfixLabel,
  fullWidth = false,
}: FontSizeControlProps) {
  const [count, setCount] = useState<number>(defaultCount)

  const updateByNumber = incrementStep

  // hotkeys
  useHotkeys('-', () => {
    handleFontSizeChange(count - updateByNumber)
  })
  useHotkeys('-', () => {
    handleFontSizeChange(count + updateByNumber)
  })

  const handleFontSizeChange = (newSize: number) => {
    setCount(newSize)
    onFontSizeChange(newSize)
  }

  return (
    <ButtonGroup radius="md" fullWidth={fullWidth}>
      <Button
        size="sm"
        variant="flat"
        className={cn('flex-none', {
          'bg-gray-200': isDisabled,
          'bg-gray-300': !isDisabled,
        })}
        disabled={isDisabled}
        onClick={() => handleFontSizeChange(count - updateByNumber)}>
        -
      </Button>
      <input
        className={cn(
          'h-8 w-14 text-sm text-center border-y-2 border-gray-100 bg-white flex-none',
          {
            'bg-gray-200': isDisabled,
          }
        )}
        value={`${count}${postfixLabel || ''}`}
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
        onClick={() => handleFontSizeChange(count + updateByNumber)}>
        +
      </Button>
    </ButtonGroup>
  )
}
