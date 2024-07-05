'use client'

import { FrameManager } from '@/components/event-content/FrameManager'
import { EventProvider } from '@/contexts/EventContext'

function EventFramesPage() {
  return (
    <EventProvider eventMode="edit">
      <FrameManager />
    </EventProvider>
  )
}

export default EventFramesPage
