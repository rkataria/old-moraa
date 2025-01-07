import { useState } from 'react'

import { Button, ButtonGroup } from '@nextui-org/react'

import { cn } from '@/utils/utils'

type NumberInputProps = {
  min?: number
  max?: number
  number?: number
  allowNegative?: boolean
  disabled?: boolean
  numbers?: number[]
  classNames?: {
    buttonGroup?: string
    button?: string
    input?: string
  }
  onNumberChange: (number: number) => void
}

export function NumberInput({
  min = 0,
  max = 100,
  number = 16,
  allowNegative = false,
  disabled = false,
  numbers = [],
  classNames = {},
  onNumberChange,
}: NumberInputProps) {
  const [value, setValue] = useState<number>(number)

  const handleNumberChange = (newSize: number) => {
    setValue(newSize)
    onNumberChange(newSize)
  }

  const pickFromNumbers = numbers.length > 0

  return (
    <ButtonGroup
      className={cn(
        {
          'opacity-80': disabled,
        },
        classNames.buttonGroup
      )}>
      <Button
        size="sm"
        variant="flat"
        className="flex-none"
        isIconOnly
        disabled={disabled || (value <= min && !allowNegative)}
        onClick={() => {
          if (disabled) return
          if (value <= min && !allowNegative) return

          if (pickFromNumbers) {
            const index = numbers.indexOf(value)
            if (index > 0) {
              handleNumberChange(numbers[index - 1])
            }

            return
          }

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
        disabled={disabled}
        onChange={(e) => {
          if (disabled) return
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
        disabled={disabled || value >= max}
        onClick={() => {
          if (disabled) return
          if (value >= max) return

          if (pickFromNumbers) {
            const index = numbers.indexOf(value)
            if (index < numbers.length - 1) {
              handleNumberChange(numbers[index + 1])
            }

            return
          }

          handleNumberChange(value + 1)
        }}>
        +
      </Button>
    </ButtonGroup>
  )
}
