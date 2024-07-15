'use client'

import { EventList } from '@/components/events/EventList'
import ProtectedLayout from '@/components/hoc/ProtectedLayout'

export default function EventsPage() {
  return (
    <ProtectedLayout>
      <div className="flex flex-col h-full">
        <EventList />
      </div>
    </ProtectedLayout>
  )
}
