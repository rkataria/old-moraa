import { createFileRoute, Outlet } from '@tanstack/react-router'

import { HeaderComponent } from '@/components/common/Header'
import { SidebarComponent } from '@/components/common/Sidebar'

export const Route = createFileRoute('/(dashboard)/_layout')({
  component: () => <DashboardLayout />,
})

function DashboardLayout() {
  return (
    <div className="flex">
      <SidebarComponent />
      <div className="w-full">
        <HeaderComponent />
        <main className="flex-grow p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
