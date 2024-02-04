import React from "react"
import { SidebarItem } from "./sidebar-item"
import { MorraLogo } from "../common/MorraLogo"

export const SidebarComponent = () => {
  return (
    <div className="w-[300px] bg-primary dark:bg-gray-800 h-screen hidden md:flex">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
        <MorraLogo />
        <SidebarItem />
      </div>
    </div>
  )
}
