/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { PiCaretDown, PiCaretUp } from 'react-icons/pi'

import { cn } from '@/utils/utils'

type DropdownItem = {
  name: string
  value: number
}

type NumberInputCaretProps = {
  min?: number
  number?: number
  allowNegative?: boolean
  step?: number
  max?: number
  selectOnFocus?: boolean
  classNames?: {
    wrapper?: string
    input?: string
    caret?: string
  }
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  dropdownItems?: DropdownItem[]
  selectedKeys?: string[]
  onChange: (number: number) => void
}

export function NumberInputCaret({
  min = 0,
  number = 16,
  allowNegative = false,
  step = 1,
  max,
  selectOnFocus,
  classNames,
  inputProps,
  dropdownItems = [],
  selectedKeys = [],
  onChange,
}: NumberInputCaretProps) {
  const [value, setValue] = useState<number>(number)
  const [open, setOpen] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleNumberChange = (newSize: number) => {
    if (newSize < 0 && !allowNegative) return
    if (max && newSize > max) return

    setValue(newSize)
    onChange(newSize)
  }

  const renderInput = () => {
    if (dropdownItems.length > 0) {
      return (
        <Dropdown
          isOpen={open}
          showArrow
          offset={10}
          onOpenChange={(v) => {
            setOpen(v)
            if (!v) {
              inputRef.current?.select()
            }
          }}>
          <DropdownTrigger>
            <input
              ref={inputRef}
              type="number"
              className={cn(
                'relative bg-white w-14 border-1 border-gray-200 px-2 py-1 focus-visible:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 rounded-md text-left',
                classNames?.input
              )}
              value={value}
              min={allowNegative ? undefined : min}
              max={max}
              step={step}
              onChange={(e) => handleNumberChange(+e.target.value)}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(true)
              }}
              onFocus={(e) => {
                if (selectOnFocus) e.target.select()
              }}
              {...inputProps}
            />
          </DropdownTrigger>
          <DropdownMenu selectedKeys={selectedKeys}>
            {dropdownItems.map((item) => (
              <DropdownItem
                key={item.name}
                className="px-2 h-8 hover:bg-gray-200"
                onClick={() => {
                  handleNumberChange(item.value)
                  setOpen(false)
                }}>
                <div className="flex justify-start items-center gap-2 p-1">
                  <span>{item.name}</span>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )
    }

    return (
      <input
        ref={inputRef}
        type="number"
        className={cn(
          'relative bg-white w-14 border-1 border-gray-200 px-2 py-1 focus-visible:outline-none focus-visible:bg-gray-100 hover:bg-gray-100 rounded-md text-left',
          classNames?.input
        )}
        value={value}
        min={allowNegative ? undefined : min}
        max={max}
        step={step}
        onChange={(e) => handleNumberChange(+e.target.value)}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        onFocus={(e) => {
          if (selectOnFocus) e.target.select()
        }}
        {...inputProps}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex justify-start items-center gap-0.5 px-0 py-0 rounded-sm text-sm',
        classNames?.wrapper
      )}>
      {renderInput()}

      <div className="flex flex-col gap-0 w-5">
        <div
          className={cn(
            'hover:bg-gray-100 rounded-t-md flex justify-center items-center border-1 border-gray-200',
            classNames?.caret,
            {
              'opacity-50 hover:bg-white': max && value === max,
            }
          )}
          onClick={() => handleNumberChange(value + step)}>
          <PiCaretUp size={14} />
        </div>
        <div
          className={cn(
            'hover:bg-gray-100 rounded-b-md flex justify-center items-center border-1 border-gray-200',
            classNames?.caret,
            {
              'opacity-50 hover:bg-white': value === 0 && !allowNegative,
            }
          )}
          onClick={() => {
            if (value > 0 || allowNegative) {
              handleNumberChange(value - step)
            }
          }}>
          <PiCaretDown size={14} />
        </div>
      </div>
    </div>
  )
}
