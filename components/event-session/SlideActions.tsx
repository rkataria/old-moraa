import React from "react"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"

const slideActions = [
  {
    key: "moveUp",
    label: "Move up",
    icon: <IconArrowUp className="h-4 w-4 text-slate-500" />,
  },
  {
    key: "moveDown",
    label: "Move down",
    icon: <IconArrowDown className="h-4 w-4 text-slate-500" />,
  },
]

export const SlideActions = ({
  triggerIcon,
  handleActions,
}: {
  triggerIcon: React.ReactNode
  handleActions: (item: any) => void
}) => {
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>{triggerIcon}</DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with icons" items={slideActions}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color="default"
            startContent={item.icon}
            className="flex items-center gap-4"
            onClick={() => handleActions(item)}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}

export default SlideActions
