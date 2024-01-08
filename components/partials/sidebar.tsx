import React from 'react'
import { SidebarItem } from './sidebar-item';

export const SidebarComponent = () => {
  return (
    <div className="w-[300px] bg-primary h-screen hidden md:flex">

      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="learign site"
          />
        </div>
        <SidebarItem />
      </div>

    </div>
  )
}
