import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { IconArrowDown, IconArrowUp, IconTrash } from '@tabler/icons-react'
import { IoDuplicateOutline, IoSaveOutline } from 'react-icons/io5'

import { FrameType } from '@/utils/frame-picker.util'

export const frameActions = [
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
  {
    key: 'save-frame-in-library',
    label: 'Save to library',
    icon: <IoSaveOutline className="h-4 w-4 text-slate-500" />,
    disableForFrames: [FrameType.BREAKOUT],
  },
]

export function FrameActions({
  triggerIcon,
  frameType,
  handleActions,
}: {
  triggerIcon: React.ReactNode
  frameType: FrameType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions: (item: any) => void
}) {
  const disabledKeys = !frameType ? ['save-frame-in-library'] : []

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>{triggerIcon}</DropdownTrigger>
      <DropdownMenu
        aria-label="Dropdown menu with icons"
        disabledKeys={disabledKeys}
        items={frameActions.filter(
          (action) => !action.disableForFrames?.includes(frameType)
        )}>
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
