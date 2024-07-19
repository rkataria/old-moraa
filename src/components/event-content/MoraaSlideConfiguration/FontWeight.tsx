/* eslint-disable jsx-a11y/control-has-associated-label */

import { Select, SelectItem } from '@nextui-org/react'

type SelectOption = {
  key: string
  label: string
}

const FONT_WEIGHTS: SelectOption[] = [
  {
    label: 'Normal',
    key: 'normal',
  },
  {
    label: 'Semibold',
    key: '500',
  },
  {
    label: 'Bold',
    key: 'bold',
  },
]

export function FontWeight({
  weight,
  onFontWeightChange,
}: {
  weight: string
  onFontWeightChange: (weight: string) => void
}) {
  return (
    <Select
      className="w-full max-w-[120px] flex-none text-xs"
      value={weight}
      variant="bordered"
      classNames={{
        mainWrapper: 'h-8',
      }}
      aria-label="Font Weight"
      selectedKeys={weight ? new Set([weight]) : new Set()}
      onChange={(e) => {
        onFontWeightChange(e.target.value)
      }}>
      {FONT_WEIGHTS.map((_fontWeight: SelectOption) => (
        <SelectItem
          key={_fontWeight.key}
          style={{
            fontFamily: _fontWeight.key,
          }}>
          {_fontWeight.label}
        </SelectItem>
      ))}
    </Select>
  )
}
