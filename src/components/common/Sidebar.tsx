import { MoraaLogo } from './MoraaLogo'
import { SidebarItem } from './SidebarItem'
import { UserMenu } from './UserMenu'

export function SidebarComponent() {
  return (
    <div className="sticky left-0 top-0 w-56 h-screen px-2 border-r-1 border-gray-200 shrink-0">
      <div className="flex flex-col grow gap-y-5 overflow-y-auto pb-4">
        <div className="flex items-center justify-between">
          <MoraaLogo color="primary" filled />
          <UserMenu />
        </div>
        <SidebarItem />
      </div>
    </div>
  )
}
