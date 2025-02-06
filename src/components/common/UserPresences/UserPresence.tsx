import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react'
import { BiDotsVertical } from 'react-icons/bi'

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/utils'

export function UserPresence({
  presence,
  following,
  onFollowUser,
}: {
  presence: {
    id: string
    isHost: boolean
    name: string
    role: string
    avatar: string
  }
  following: boolean
  onFollowUser?: (userId: string) => void
}) {
  return (
    <div
      className={cn(
        'flex justify-between items-center gap-2 w-full hover:bg-primary-50 p-2 rounded-md',
        {
          'bg-primary-50': following,
        }
      )}>
      <User
        name={presence.name}
        avatarProps={{
          size: 'sm',
          src: presence.avatar,
        }}
      />
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" isIconOnly>
            <BiDotsVertical size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="follow"
            onClick={() => onFollowUser?.(presence.id)}>
            Follow
          </DropdownItem>
          {/* <RenderIf isTrue={presence.isHost}>
            <DropdownItem key="bring-to-me">Bring to me</DropdownItem>
          </RenderIf> */}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
