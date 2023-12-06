"use client"
import { EventSessionProvider } from "@/contexts/EventSessionContext"

export default async function MeetingLayout({ children }: any) {
  return (
    <EventSessionProvider>
      <div className="bg-gray-100">{children}</div>
    </EventSessionProvider>
  )
}
