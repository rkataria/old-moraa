import { useContext } from 'react'

import { useParams } from '@tanstack/react-router'

import { BlurbEditor } from './BlurbEditor'
import { EventDetails } from './EventDetails'

import { ThemeEffects } from '@/components/events/ThemeEffects'
import { EventContext } from '@/contexts/EventContext'
import { useEvent } from '@/hooks/useEvent'
import { EventContextType } from '@/types/event-context.type'

export function EventInfo() {
  const { preview } = useContext(EventContext) as EventContextType
  const { eventId } = useParams({ strict: false })
  const eventData = useEvent({ id: eventId! })

  const { event } = eventData

  if (preview) {
    return (
      <ThemeEffects selectedTheme={event.theme} className="w-full">
        <div className="flex flex-col gap-3 h-full w-[56.25rem] mx-auto scrollbar-none relative z-[50]">
          <EventDetails />
          <BlurbEditor />
        </div>
      </ThemeEffects>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full w-[56.25rem] mx-auto scrollbar-none relative z-[50]">
      <EventDetails />
      <BlurbEditor />
    </div>
  )
}
