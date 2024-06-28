import { useState } from 'react'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'

import { UserAvatar } from './UserAvatar'
import { NamesForm } from '../auth/NamesForm'

import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

export function UserMenu() {
  const { currentUser, logout } = useAuth()
  const { data: profile } = useProfile()
  const [isShowNamesModal, setIsShowNamesModal] = useState(false)

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <UserAvatar
            profile={profile}
            avatarProps={{
              radius: 'lg',
              classNames: { base: 'w-9 h-9 min-w-max' },
            }}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="profile"
            className="h-14 gap-2 hover:bg-transparent">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{currentUser?.email}</p>
          </DropdownItem>
          <DropdownItem
            key="edit"
            className="h-8 gap-2"
            onClick={() => setIsShowNamesModal(true)}>
            Edit
          </DropdownItem>
          <DropdownItem key="logout" className="h-8 gap-2" onClick={logout}>
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <NamesForm
        isEdit
        show={isShowNamesModal}
        closeHandler={() => setIsShowNamesModal(false)}
      />
    </>
  )
}
