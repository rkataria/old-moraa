import { useState } from 'react'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@nextui-org/react'

import { NamesForm } from '../auth/NamesForm'

import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

export function UserMenu() {
  const { currentUser, logout } = useAuth()
  const { data: profile, isRequiredNames } = useProfile()
  const [isShowNamesModal, setIsShowNamesModal] = useState(false)

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          {!isRequiredNames ? (
            <Avatar
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`${profile.first_name} ${profile.last_name}`)}`}
            />
          ) : (
            <Avatar
              isBordered
              className="h-8 w-8 cursor-pointer"
              src="https://github.com/shadcn.png"
            />
          )}
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
