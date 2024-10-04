import { useParams } from '@tanstack/react-router'

import { EventDetails } from '@/components/event-content/overview-frame/EventInfo/EventDetails'
import { ThemeEffects } from '@/components/events/ThemeEffects'
import { theme } from '@/components/events/ThemeModal'
import { useEvent } from '@/hooks/useEvent'

export function LandingPage() {
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId! })

  if (!event) return null

  return (
    <ThemeEffects selectedTheme={event.theme as unknown as theme}>
      <div className="mx-auto max-w-screen-lg py-10">
        <EventDetails />
      </div>
    </ThemeEffects>
  )
}
