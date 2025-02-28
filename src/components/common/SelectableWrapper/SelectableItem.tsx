import React from 'react'

import { Card } from '@heroui/react'

import { UseSelectableReturn } from './useSelectable'

import { cn } from '@/utils/utils'

type SelectableItemProps<T> = {
  item: T
  selection: UseSelectableReturn<T>
  children: React.ReactNode
  className?: string
}

export function SelectableItem<T>({
  item,
  selection,
  children,
  className,
}: SelectableItemProps<T>) {
  const { isSelected, toggleSelection } = selection

  return (
    <Card
      isPressable
      isHoverable
      disableRipple
      onClick={() => toggleSelection(item)}
      className={cn(
        'border-3 rounded',
        {
          'border-blue-500 bg-blue-100': isSelected(item),
        },
        className
      )}>
      {children}
    </Card>
  )
}
