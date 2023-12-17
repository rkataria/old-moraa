"use client"
import Header from "@/components/slides/Header"
import { useEvent } from "@/hooks/useEvent"

export default function SlidesLayout({ children, params }: any) {
  const { eventId } = params
  const { event, error } = useEvent({ id: eventId })

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
