import { useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { LuSettings2, LuUser2 } from 'react-icons/lu'

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/utils'

export function PollConfigs() {
  const [open, setOpen] = useState(false)

  return (
    <Dropdown offset={10} onOpenChange={setOpen} placement="top">
      <DropdownTrigger>
        <Button
          variant="light"
          className={cn('live-button', {
            active: open,
          })}
          isIconOnly>
          {open ? <LuSettings2 size={18} /> : <LuSettings2 size={18} />}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          key="multiple-responses"
          startContent={<LuUser2 />}
          onClick={() => {}}>
          Allow multiple responses
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
