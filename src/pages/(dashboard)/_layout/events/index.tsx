import { createFileRoute } from '@tanstack/react-router'

import { EventList } from '@/components/events/EventList'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/(dashboard)/_layout/events/')({
  component: () => <EventsPage />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad,
})

export function EventsPage() {
  return <EventList />
}
