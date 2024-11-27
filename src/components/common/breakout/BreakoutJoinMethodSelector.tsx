import { Select, SelectItem } from '@nextui-org/react'

import { cn } from '@/utils/utils'

const BREAKOUT_JOIN_METHODS = [
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

export type BreakoutJoinMethod = 'auto' | 'manual' | 'choose'

type BreakoutJoinMethodSelectorProps = {
  breakoutJoinMethod?: string
  layout?: 'rows' | 'columns'
  label?: string
  onChange?: (value: BreakoutJoinMethod) => void
}

export function BreakoutJoinMethodSelector({
  breakoutJoinMethod,
  layout,
  label,
  onChange,
}: BreakoutJoinMethodSelectorProps) {
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
          value={breakoutJoinMethod}
          variant="bordered"
          size="sm"
          classNames={{
            trigger: 'border-1 rounded-md shadow-none',
          }}
          aria-label="How participants can join"
          selectedKeys={
            breakoutJoinMethod ? new Set([breakoutJoinMethod]) : new Set()
          }
          onChange={(e) => {
            onChange?.(e.target.value as BreakoutJoinMethod)
          }}>
          {BREAKOUT_JOIN_METHODS.map((method) => (
            <SelectItem key={method.value}>{method.label}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  )
}
