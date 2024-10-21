import { createFileRoute, Outlet } from '@tanstack/react-router'

import { HeaderComponent } from '@/components/common/Header'
import { SidebarComponent } from '@/components/common/Sidebar'

export const Route = createFileRoute('/(dashboard)/_layout')({
  component: () => <DashboardLayout />,
})

function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen">
      <HeaderComponent />

      <div className="w-full flex h-full">
        <SidebarComponent />
        <main className="flex-grow p-8 bg-white max-h-[calc(100vh_-_56px)] overflow-y-auto scrollbar-none">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
