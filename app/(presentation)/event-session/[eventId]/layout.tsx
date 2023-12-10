"use client"
import { EventSessionProvider } from "@/contexts/EventSessionContext"

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EventSessionProvider>
      <div>{children}</div>
    </EventSessionProvider>
  )
}
