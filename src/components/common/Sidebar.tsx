import { MoraaLogo } from './MoraaLogo'
import { SidebarItem } from './SidebarItem'
import { UserMenu } from './UserMenu'

export function SidebarComponent() {
  return (
    <div className="sticky top-0 w-72 bg-white dark:bg-gray-800 h-screen hidden md:flex flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-1 pb-4">
        <div className="flex items-center justify-between pr-3">
          <MoraaLogo color="primary" filled className="ml-3" />

          <UserMenu />
        </div>
        <SidebarItem />
      </div>
    </div>
  )
}
