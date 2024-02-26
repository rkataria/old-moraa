import React from "react"

import { UserMenu } from "./UserMenu"
import { SidebarMini } from "./SidebarMini"
import { ThemeSwitcher } from "../common/ThemeSwitcher"

export const HeaderComponent = (props: {}) => {
  return (
    <div className="flex justify-between items-center shadow-md sticky top-0 z-40 h-16">
      <SidebarMini />

      <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6 pr-2">
        <div className="flex items-center gap-x-4 lg:gap-x-6 mr-4">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </div>
    </div>
  )
}
