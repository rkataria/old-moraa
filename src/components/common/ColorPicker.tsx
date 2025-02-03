/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { HexColorPicker } from 'react-colorful'

import { CUSTOM_COLORS } from '@/constants/common'
import { cn } from '@/utils/utils'

export type ColorPickerProps = {
  trigger?: React.ReactNode
  defaultColor?: string
  customColors?: string[]
  className?: string
  style?: React.CSSProperties
  onChange: (color: string) => void
}

export function ColorPicker({
  trigger,
  defaultColor = '#000000',
  customColors = CUSTOM_COLORS,
  className,
  style = {},
  onChange,
}: ColorPickerProps) {
  const [color, setColor] = useState(defaultColor)

  useEffect(() => {
    setColor(defaultColor)
  }, [defaultColor])

  useEffect(() => {
    if (color === defaultColor) return

    onChange(color)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isCorrectColor = /^#([0-9A-F]{3}){1,2}$/i.test(event.target.value)

    if (!isCorrectColor) return

    setColor(event.target.value)
  }

  return (
    <Popover placement="right">
      <PopoverTrigger>
        {trigger || (
          <div
            className={cn(
              'size-4 border-1 border-black rounded-full cursor-pointer',
              className
            )}
            style={{
              ...style,
              backgroundColor: color,
            }}
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <div className="flex flex-col gap-2">
          <HexColorPicker
            className="!w-full h-[220px]"
            color={color}
            onChange={setColor}
          />
          <input
            type="text"
            className="w-full p-2 text-black bg-white border rounded dark:bg-black dark:text-white border-neutral-200 dark:border-neutral-800 focus:outline-1 focus:ring-0 focus:outline-neutral-300 dark:focus:outline-neutral-700"
            placeholder="#000000"
            onChange={handleInputChange}
          />
          <div className="flex flex-wrap justify-between items-center gap-1 w-full">
            {customColors.map((currentColor) => (
              <button
                type="button"
                className="h-6 w-6 rounded-md cursor-pointer border-1 border-transparent hover:border-black"
                style={{
                  backgroundColor: currentColor,
                }}
                onClick={() => {
                  setColor(currentColor)
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
