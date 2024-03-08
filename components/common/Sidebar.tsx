import React from 'react'

import { MoraaLogo } from './MoraaLogo'
import { SidebarItem } from './SidebarItem'

export function SidebarComponent() {
  return (
    <div className="sticky top-0 w-[300px] bg-primary dark:bg-gray-800 h-screen hidden md:flex">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
        <MoraaLogo />
        <SidebarItem />
      </div>
    </div>
  )
}
