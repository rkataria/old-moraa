/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { PiCaretDown, PiCaretUp } from 'react-icons/pi'

import { cn } from '@/utils/utils'

type NumberInputCaretProps = {
  min?: number
  number?: number
  allowNegative?: boolean
  classNames?: {
    wrapper?: string
    input?: string
    caret?: string
  }
  onChange: (number: number) => void
}

export function NumberInputCaret({
  min = 0,
  number = 16,
  allowNegative = false,
  classNames,
  onChange,
}: NumberInputCaretProps) {
  const [value, setValue] = useState<number>(number)

  const handleNumberChange = (newSize: number) => {
    setValue(newSize)
    onChange(newSize)
  }

  return (
    <div
      className={cn(
        'flex justify-start items-center gap-0.5 px-0 py-0 rounded-sm text-sm',
        classNames?.wrapper
      )}>
      <input
        type="number"
        className={cn(
          'p-1 focus-visible:outline-none w-8 focus-visible:bg-gray-100 hover:bg-gray-100 text-right rounded-sm',
          classNames?.input
        )}
        value={value}
        min={allowNegative ? undefined : min}
        onChange={(e) => handleNumberChange(+e.target.value)}
      />
      <div className="flex flex-col w-5">
        <div
          className={cn(
            'hover:bg-gray-100 rounded-t-sm flex justify-center items-center',
            classNames?.caret
          )}
          onClick={() => handleNumberChange(value + 1)}>
          <PiCaretUp size={14} />
        </div>
        <div
          className={cn(
            'hover:bg-gray-100 rounded-t-sm flex justify-center items-center',
            classNames?.caret
          )}
          onClick={() => {
            if (value > 0 || allowNegative) {
              handleNumberChange(value - 1)
            }
          }}>
          <PiCaretDown size={14} />
        </div>
      </div>
    </div>
  )
}
