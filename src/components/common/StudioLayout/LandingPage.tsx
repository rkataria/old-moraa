import { useContext } from 'react'

import { useParams } from '@tanstack/react-router'

import { EventDetails } from '@/components/event-content/overview-frame/EventInfo/EventDetails'
import { FrameDetailsView } from '@/components/event-content/overview-frame/FrameDetailsView'
import { ThemeEffects } from '@/components/events/ThemeEffects'
import { theme } from '@/components/events/ThemeModal'
import { EventContext } from '@/contexts/EventContext'
import { useEvent } from '@/hooks/useEvent'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function LandingPage() {
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId! })
  const { permissions } = useEventPermissions()
  const { preview } = useContext(EventContext) as EventContextType

  if (!event) return null

  const renderContent = () => {
    if (!permissions.canUpdateFrame) {
      return <FrameDetailsView />
    }

    if (preview) return <FrameDetailsView />

    return <EventDetails />
  }

  return (
    <ThemeEffects
      selectedTheme={event.theme as unknown as theme}
      className="h-full">
      <div
        className={cn(
          'pr-4 max-w-screen-xl py-10 overflow-y-auto h-full scrollbar-none pl-16'
        )}>
        {renderContent()}
      </div>
    </ThemeEffects>
  )
}
