"use client"
import { EventSessionProvider } from "@/contexts/EventSessionContext"

export default async function MeetingLayout({ children }: any) {
  return (
    <EventSessionProvider>
      <div>{children}</div>
    </EventSessionProvider>
  )
}
