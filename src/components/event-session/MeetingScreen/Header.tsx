import { useParams } from '@tanstack/react-router'

import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MediaSettingsToggle } from '../MediaSettingsToggle'

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
      <div className="flex justify-end items-center gap-2 h-full bg-white p-2 rounded-md shadow-2xl">
        <div className="pl-2 pr-4 border-r-2 border-gray-200">
          <Logo />
        </div>
        <div className="pr-4 pl-2 border-r-0 border-gray-200">{event.name}</div>
      </div>
      <div className="flex justify-end items-center gap-2 h-full bg-white p-2 rounded-md shadow-2xl">
        <HelpButton />
        <MediaSettingsToggle
          buttonProps={{
            variant: 'light',
            className: cn('bg-transparent hover:bg-black/10', {
              'bg-primary text-white hover:bg-primary/80':
                dyteStates.activeSettings,
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
              className: 'bg-transparent hover:bg-black/10',
            }}
          />
        )}
        <LeaveMeetingToggle />
        {/* <UserMenu /> */}
      </div>
    </div>
  )
}
