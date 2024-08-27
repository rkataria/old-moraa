import { createFileRoute } from '@tanstack/react-router'

import { EventList } from '@/components/events/EventList'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/(dashboard)/_layout/events/')({
  component: () => <EventsPage />,
  beforeLoad,
})

export function EventsPage() {
  return <EventList />
}
