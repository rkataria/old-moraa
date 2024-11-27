import { Select, SelectItem } from '@nextui-org/react'

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
  onChange?: (value: AssignmentOption) => void
}

export function AssignmentOptionSelector({
  assignmentOption,
  layout,
  label,
  onChange,
}: AssignmentOptionSelectorProps) {
  return (
    <div
      className={cn({
        'w-full': !label,
        'grid grid-cols-[50%_50%] gap-2': label && layout === 'columns',
        'flex flex-col gap-2': label && layout === 'rows',
      })}>
      {label && (
        <div>
          <p>{label}</p>
        </div>
      )}
      <div className="flex justify-start items-center">
        <Select
          className="w-full flex-none text-xs"
          value={assignmentOption}
          variant="bordered"
          size="sm"
          classNames={{
            trigger: 'border-1 rounded-md shadow-none',
          }}
          aria-label="How participants can join"
          selectedKeys={
            assignmentOption ? new Set([assignmentOption]) : new Set()
          }
          onChange={(e) => {
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
