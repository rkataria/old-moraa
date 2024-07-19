'use client'

import { createFileRoute } from '@tanstack/react-router'

import { SidebarComponent } from '@/components/common/Sidebar'
import { EventList } from '@/components/events/EventList'

export function EventsPage() {
  return (
    <div className="flex">
      <SidebarComponent />
      <main className="relative p-4 w-full bg-[#FAFAFA] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col h-full">
          <EventList />
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/events/')({
  component: EventsPage,
})
