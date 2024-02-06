"use client"
import Header from "@/components/event-content/Header"
import { useEvent } from "@/hooks/useEvent"

export default function RootLayout({ params, children }: any) {
  const { eventId } = params
  const { event, error } = useEvent({ id: eventId })

  console.log("layout.tsx eventId: ", eventId)
  console.log("layout.tsx event: ", event)
  if (error) {
    return null
  }

  return (
    <div>
      <Header event={event} />
      {children}
    </div>
  )
}
