import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/layout')({
  component: EventContentLayout,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EventContentLayout({ children }: any) {
  return <div>{children}</div>
}
