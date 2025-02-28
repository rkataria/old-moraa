import { useCallback } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { IoChevronDown } from 'react-icons/io5'

import {
  DropdownButton,
  DropdownCategoryTitle,
} from '@/components/tiptap/ui/Dropdown'

const FONT_FAMILY_GROUPS = [
  {
    label: 'Sans Serif',
    options: [
      { label: 'Inter', value: '' },
      { label: 'Arial', value: 'Arial' },
      { label: 'Helvetica', value: 'Helvetica' },
    ],
  },
  {
    label: 'Serif',
    options: [
      { label: 'Times New Roman', value: 'Times' },
      { label: 'Garamond', value: 'Garamond' },
      { label: 'Georgia', value: 'Georgia' },
    ],
  },
  {
    label: 'Monospace',
    options: [
      { label: 'Courier', value: 'Courier' },
      { label: 'Courier New', value: 'Courier New' },
    ],
  },
]

const FONT_FAMILIES = FONT_FAMILY_GROUPS.flatMap((group) => [
  group.options,
]).flat()

export type FontFamilyPickerProps = {
  onChange: (value: string) => void // eslint-disable-line no-unused-vars
  value: string
}

export function FontFamilyPicker({ onChange, value }: FontFamilyPickerProps) {
  const currentValue = FONT_FAMILIES.find((size) => size.value === value)
  const currentFontLabel = currentValue?.label.split(' ')[0] || 'Inter'

  const selectFont = useCallback(
    (font: string) => () => onChange(font),
    [onChange]
  )

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button className="h-8 bg-gray-200" endContent={<IoChevronDown />}>
          {currentFontLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {() => (
          <div>
            {FONT_FAMILY_GROUPS.map((group) => (
              <div
                className="mt-2.5 first:mt-0 gap-0.5 flex flex-col"
                key={group.label}>
                <DropdownCategoryTitle>{group.label}</DropdownCategoryTitle>
                {group.options.map((font) => (
                  <DropdownButton
                    isActive={value === font.value}
                    onClick={selectFont(font.value)}
                    key={`${font.label}_${font.value}`}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </DropdownButton>
                ))}
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
