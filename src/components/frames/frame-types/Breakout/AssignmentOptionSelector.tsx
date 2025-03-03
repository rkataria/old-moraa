import { Select, SelectItem } from '@heroui/react'

import { cn } from '@/utils/utils'

const ASSIGNMENT_OPTIONS = [
  {
    label: 'Automatically',
    value: 'auto',
  },
  {
    label: 'Manually',
    value: 'manual',
  },
  {
    label: 'Participants can choose',
    value: 'choose',
  },
]

export type AssignmentOption = 'auto' | 'manual' | 'choose'

type AssignmentOptionSelectorProps = {
  assignmentOption?: string
  layout?: 'rows' | 'columns'
  label?: string
  disabled?: boolean
  onChange?: (value: AssignmentOption) => void
}

export function AssignmentOptionSelector({
  assignmentOption,
  layout,
  label,
  disabled,
  onChange,
}: AssignmentOptionSelectorProps) {
  return (
    <div
      className={cn({
        'w-full': !label,
        'grid grid-cols-[50%_50%] gap-2': label && layout === 'columns',
        'flex flex-col gap-2': label && layout === 'rows',
      })}>
      <p className="flex items-center">
        {label && (
          <div>
            <p>{label}</p>
          </div>
        )}
      </p>
      <div className="flex justify-start items-center">
        <Select
          className="w-full flex-none text-xs"
          value={assignmentOption}
          variant="bordered"
          size="sm"
          isDisabled={disabled}
          classNames={{
            trigger: 'border-1 rounded-md shadow-none',
          }}
          aria-label="How participants can join"
          selectedKeys={
            assignmentOption ? new Set([assignmentOption]) : new Set()
          }
          onChange={(e) => {
            if (disabled) return
            onChange?.(e.target.value as AssignmentOption)
          }}>
          {ASSIGNMENT_OPTIONS.map((method) => (
            <SelectItem key={method.value}>{method.label}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  )
}
