import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react"
import { useAuth } from "@/hooks/useAuth"

export const UserMenu = () => {
  const { currentUser, logout } = useAuth()

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          className="h-8 w-8 cursor-pointer"
          src="https://github.com/shadcn.png"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2 hover:bg-transparent">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{currentUser?.email}</p>
        </DropdownItem>
        <DropdownItem key="logout" className="h-8 gap-2" onClick={logout}>
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
