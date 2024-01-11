"use client"

import { HeaderComponent } from "@/components/partials/header"
import { SidebarComponent } from "@/components/partials/sidebar"

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <SidebarComponent />
      <div className="flex flex-col w-full">
        <HeaderComponent />
        <div className="p-4">
          <main className="relative">{children}</main>
        </div>
      </div>
    </div>
  )
}
