import React from 'react'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'

export type DropdownAction = {
  key: string
  label: string
  icon: React.ReactNode
}

export function DropdownActions({
  triggerIcon,
  actions,
  onAction,
}: {
  triggerIcon: React.ReactNode
  actions: DropdownAction[]
  onAction: (key: React.Key) => void
}) {
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>{triggerIcon}</DropdownTrigger>
      <DropdownMenu items={actions} onAction={onAction}>
        {(item) => (
          <DropdownItem
            key={item.key}
            startContent={item.icon}
            className="flex items-center gap-2 hover:bg-gray-200 !outline-none">
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
