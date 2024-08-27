import { createFileRoute } from '@tanstack/react-router'

import { FrameManager } from '@/components/event-content/FrameManager'
import { EventProvider } from '@/contexts/EventContext'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/events/$eventId/')({
  component: EventFramesPage,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad,
})

export function EventFramesPage() {
  return (
    <EventProvider eventMode="edit">
      <FrameManager />
    </EventProvider>
  )
}
