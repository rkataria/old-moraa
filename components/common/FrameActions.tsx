import React from 'react'

import { IconArrowDown, IconArrowUp, IconTrash } from '@tabler/icons-react'
import { IoDuplicateOutline } from 'react-icons/io5'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'

const frameActions = [
  {
    key: 'delete',
    label: 'Delete',
    icon: <IconTrash className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'move-up',
    label: 'Move up',
    icon: <IconArrowUp className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'move-down',
    label: 'Move down',
    icon: <IconArrowDown className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'duplicate-frame',
    label: 'Duplicate frame',
    icon: <IoDuplicateOutline className="h-4 w-4 text-slate-500" />,
  },
]

export function FrameActions({
  triggerIcon,
  handleActions,
}: {
  triggerIcon: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions: (item: any) => void
}) {
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>{triggerIcon}</DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with icons" items={frameActions}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color="default"
            startContent={item.icon}
            className="flex items-center gap-4"
            onClick={() => handleActions(item)}>
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
