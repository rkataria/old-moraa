import { useParams } from '@tanstack/react-router'

import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MediaSettingsToggle } from '../MediaSettingsToggle'
import { Timer } from '../Timer'

import { AddParticipantsButtonWithModal } from '@/components/common/AddParticipantsButtonWithModal'
import { HelpButton } from '@/components/common/HelpButton'
import { Logo } from '@/components/common/Logo'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { cn } from '@/utils/utils'

export function Header() {
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId as string })
  const { dyteStates, setDyteStates, isHost } = useEventSession()

  if (!event) return null

  return (
    <div className="h-full w-full flex justify-between items-center p-2">
      <div className="flex justify-end items-center gap-2 h-full p-2">
        <div className="pl-2 pr-4 border-r-2 border-gray-200">
          <Logo />
        </div>
        <div className="pr-4 pl-2 border-r-0 border-gray-200">{event.name}</div>
      </div>
      <Timer />
      <div className="flex justify-end items-center gap-2 h-full p-2">
        <HelpButton />
        <MediaSettingsToggle
          buttonProps={{
            variant: 'light',
            className: cn('live-button', {
              active: dyteStates.activeSettings,
            }),
          }}
          onClick={() =>
            setDyteStates((prevDyteStates) => ({
              ...prevDyteStates,
              activeSettings: true,
            }))
          }
        />
        {isHost && (
          <AddParticipantsButtonWithModal
            eventId={eventId!}
            triggerButtonProps={{
              variant: 'light',
              className: 'live-button',
            }}
          />
        )}
        <LeaveMeetingToggle />
        {/* <UserMenu /> */}
      </div>
    </div>
  )
}
