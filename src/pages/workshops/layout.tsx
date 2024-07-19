import { createFileRoute } from '@tanstack/react-router'

import { SidebarComponent } from '@/components/common/Sidebar'

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SidebarComponent />
      <main className="relative p-4 w-full bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 pt-12">
        {children}
      </main>
    </div>
  )
}

export const Route = createFileRoute('/workshops/layout')({
  component: WorkspaceLayout,
})
