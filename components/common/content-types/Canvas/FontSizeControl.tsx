import { useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { Button, ButtonGroup } from '@nextui-org/react'

type FontSizeControlProps = {
  size?: number
  onFontSizeChange: (size: number) => void
}

export function FontSizeControl({
  size = 16,
  onFontSizeChange,
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
        className="flex-none"
        onClick={() => handleFontSizeChange(fontSize - 1)}>
        -
      </Button>
      <input
        className="w-8 h-8 text-sm text-center border-y-2 border-gray-100 bg-white flex-none"
        value={fontSize}
        onChange={(e) => handleFontSizeChange(+e.target.value)}
      />
      <Button
        size="sm"
        variant="flat"
        className="flex-none"
        onClick={() => handleFontSizeChange(fontSize + 1)}>
        +
      </Button>
    </ButtonGroup>
  )
}
