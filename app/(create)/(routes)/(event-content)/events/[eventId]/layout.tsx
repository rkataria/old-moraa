'use client'

import { Header } from '@/components/event-content/Header'
import { useEvent } from '@/hooks/useEvent'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RootLayout({ params, children }: any) {
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
