import { useState } from 'react'

import { Button, ButtonGroup } from '@nextui-org/react'

type NumberInputProps = {
  min?: number
  max?: number
  number?: number
  allowNegative?: boolean
  onNumberChange: (number: number) => void
}

export function NumberInput({
  min = 0,
  max = 100,
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
        isIconOnly
        disabled={value <= min && !allowNegative}
        onClick={() => {
          if (value > min || allowNegative) {
            handleNumberChange(value - 1)
          }
        }}>
        -
      </Button>
      <input
        className="w-8 h-8 text-sm text-center border-y-2 border-gray-100 bg-white flex-none"
        value={value}
        min={allowNegative ? undefined : min}
        max={max}
        onChange={(e) => {
          if (/[^0-9]/.test(e.target.value)) return
          if (+e.target.value > max) return
          if (+e.target.value < min && !allowNegative) return

          handleNumberChange(+e.target.value)
        }}
      />
      <Button
        size="sm"
        variant="flat"
        className="flex-none"
        isIconOnly
        disabled={value >= max}
        onClick={() => {
          if (value >= max) return
          handleNumberChange(value + 1)
        }}>
        +
      </Button>
    </ButtonGroup>
  )
}
