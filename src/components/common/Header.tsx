import { SidebarMini } from './SidebarMini'
import { UserMenu } from './UserMenu'

export function HeaderComponent() {
  return (
    <div className="flex justify-between items-center sticky top-0 z-[50] h-16 bg-background px-6">
      <SidebarMini />

      <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <UserMenu />
        </div>
      </div>
    </div>
  )
}
