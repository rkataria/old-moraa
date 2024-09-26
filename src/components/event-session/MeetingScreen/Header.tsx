import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from '@tanstack/react-router'

import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MediaSettingsToggle } from '../MediaSettingsToggle'

import { AddParticipantsButtonWithModal } from '@/components/common/AddParticipantsButtonWithModal'
import { ControlButton } from '@/components/common/ControlButton'
import { HelpButton } from '@/components/common/HelpButton'
import { Logo } from '@/components/common/Logo'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'

export function Header() {
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId as string })
  const { meeting } = useDyteMeeting()
  const { setDyteStates } = useEventSession()

  if (!event) return null

  return (
    <div className="h-full w-full flex justify-between items-center px-2">
      <div className="flex justify-end items-center gap-6">
        <Logo className="text-white" />
        <span className="max-w-[10.9375rem] overflow-hidden !whitespace-nowrap text-ellipsis font-semibold text-white">
          {event.name}
        </span>
        <ControlButton
          buttonProps={{
            variant: 'light',
            size: 'sm',
            className: 'bg-gray-200 px-2',
          }}
          tooltipProps={{
            label: 'Meeting time',
          }}
          onClick={() => {}}>
          <DyteClock meeting={meeting} className="m-0" />
        </ControlButton>
      </div>
      <div className="flex justify-end items-center gap-3">
        <HelpButton
          buttonProps={{
            variant: 'light',
            className: 'bg-black/10 text-white hover:bg-black/20',
          }}
        />
        <MediaSettingsToggle
          buttonProps={{
            variant: 'light',
            className: 'bg-black/10 text-white hover:bg-black/20',
          }}
          onClick={() =>
            setDyteStates((prevDyteStates) => ({
              ...prevDyteStates,
              activeSettings: true,
            }))
          }
        />
        <AddParticipantsButtonWithModal
          eventId={eventId!}
          triggerButtonProps={{
            variant: 'light',
            className: 'bg-black/10 text-white hover:bg-black/20',
          }}
        />
        <LeaveMeetingToggle />
        {/* <UserMenu /> */}
      </div>
    </div>
  )
}
