import React from "react"

import { UserMenu } from "./user-menu"
import { SidebarMini } from "./sidebar-mini"
import { ThemeSwitcher } from "../common/ThemeSwitcher"

export const HeaderComponent = (props: {}) => {
  return (
    <div className="flex justify-between items-center shadow-md sticky top-0 z-40 ">
      <div className="flex h-16 shrink-0 bg-white text-black dark:bg-background dark:text-foreground px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <SidebarMini />
      </div>

      <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6 pr-2">
        <div className="flex items-center gap-x-4 lg:gap-x-6 mr-4">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </div>
    </div>
  )
}
