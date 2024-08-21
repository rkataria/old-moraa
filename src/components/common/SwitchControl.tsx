import { useEffect, useState } from 'react'

import { Switch } from '@nextui-org/react'

import { LabelWithInlineControl } from './LabelWithInlineControl'

import { cn } from '@/utils/utils'

type SwitchControlProps = {
  label: string
  onChange: (value: boolean) => void
  checked: boolean
}

export function SwitchControl({
  label,
  onChange,
  checked,
}: SwitchControlProps) {
  const [value, setValue] = useState(checked)

  useEffect(() => {
    if (value === checked) return

    setValue(checked)
  }, [value, checked])

  const handleChange = () => {
    setValue((prev) => !prev)
    onChange(!value)
  }

  return (
    <LabelWithInlineControl
      label={label}
      control={
        <Switch
          isSelected={value}
          size="sm"
          color="primary"
          classNames={{
            wrapper: 'h-5 w-9 mr-0',
            thumb: cn('w-3 h-3'),
          }}
          onValueChange={handleChange}
        />
      }
    />
  )
}
