'use client'

import { FrameManager } from '@/components/event-content/FrameManager'
import ProtectedLayout from '@/components/hoc/ProtectedLayout'
import { EventProvider } from '@/contexts/EventContext'

function EventFramesPage() {
  return (
    <ProtectedLayout>
      <EventProvider eventMode="edit">
        <FrameManager />
      </EventProvider>
    </ProtectedLayout>
  )
}

export default EventFramesPage
