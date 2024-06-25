'use client'

import { ReactNode } from 'react'

import { usePathname } from 'next/navigation'

import { SidebarComponent } from '@/components/common/Sidebar'

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname.includes('create')) {
    return children
  }

  return (
    <div className="flex">
      <SidebarComponent />
      <main className="relative p-4 w-full bg-[#FAFAFA] px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
