import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/event-session/$eventId/layout')({
  component: EventSessionLayout,
})

export function EventSessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
