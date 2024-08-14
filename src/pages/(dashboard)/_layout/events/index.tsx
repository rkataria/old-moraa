import { createFileRoute } from '@tanstack/react-router'

import { EventList } from '@/components/events/EventList'

export const Route = createFileRoute('/(dashboard)/_layout/events/')({
  component: () => <EventsPage />,
})

export function EventsPage() {
  return <EventList />
}
