import { createFileRoute } from '@tanstack/react-router'

import { FrameManager } from '@/components/event-content/FrameManager'
import { EventProvider } from '@/contexts/EventContext'

export const Route = createFileRoute('/events/$eventId/')({
  component: EventFramesPage,
})

export function EventFramesPage() {
  return (
    <EventProvider eventMode="edit">
      <FrameManager />
    </EventProvider>
  )
}
