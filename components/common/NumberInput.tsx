import { useState } from 'react'

import { Button, ButtonGroup } from '@nextui-org/react'

type NumberInputProps = {
  min?: number
  number?: number
  allowNegative?: boolean
  onNumberChange: (number: number) => void
}

export function NumberInput({
  min = 0,
  number = 16,
  allowNegative = false,
  onNumberChange,
}: NumberInputProps) {
  const [value, setValue] = useState<number>(number)

  const handleNumberChange = (newSize: number) => {
    setValue(newSize)
    onNumberChange(newSize)
  }

  return (
    <ButtonGroup radius="md">
      <Button
        size="sm"
        variant="flat"
        className="flex-none"
        disabled={value <= 0 && !allowNegative}
        onClick={() => {
          if (value > 0 || allowNegative) {
            handleNumberChange(value - 1)
          }
        }}>
        -
      </Button>
      <input
        className="w-8 h-8 text-sm text-center border-y-2 border-gray-100 bg-white flex-none"
        value={value}
        min={allowNegative ? undefined : min}
        onChange={(e) => handleNumberChange(+e.target.value)}
      />
      <Button
        size="sm"
        variant="flat"
        className="flex-none"
        onClick={() => handleNumberChange(value + 1)}>
        +
      </Button>
    </ButtonGroup>
  )
}
