import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Header } from '@/components/recording/Header'

export const Route = createFileRoute('/events/$eventId/recordings/_layout')({
  component: () => <DashboardLayout />,
})

function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow h-full bg-white max-h-[calc(100vh_-_56px)] overflow-y-auto scrollbar-none">
        <Outlet />
      </main>
    </div>
  )
}
