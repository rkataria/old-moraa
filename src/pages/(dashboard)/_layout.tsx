import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SidebarComponent } from '@/components/common/Sidebar'

export const Route = createFileRoute('/(dashboard)/_layout')({
  component: () => <DashboardLayout />,
})

function DashboardLayout() {
  return (
    <div className="flex">
      <SidebarComponent />
      <main className="flex-grow p-10 bg-white">
        <Outlet />
      </main>
    </div>
  )
}
