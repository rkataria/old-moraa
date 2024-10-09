import { useParams } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'

import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MediaSettingsToggle } from '../MediaSettingsToggle'
import { Timer } from '../Timer'

import { AddParticipantsButtonWithModal } from '@/components/common/AddParticipantsButtonWithModal'
import { AgendaPanelToggle } from '@/components/common/AgendaPanel/AgendaPanelToggle'
import { HelpButton } from '@/components/common/HelpButton'
import { Logo } from '@/components/common/Logo'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useStoreSelector } from '@/hooks/useRedux'
import { toggleLeftSidebarAction } from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function Header() {
  const dispatch = useDispatch()
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId as string })
  const { dyteStates, setDyteStates, isHost } = useEventSession()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)

  if (!event) return null

  return (
    <div className="h-full w-full flex justify-between items-center px-4">
      <div className="flex justify-end items-center gap-2 h-full">
        <div className="pr-4 border-r-2 border-gray-200">
          {isHost ? (
            <AgendaPanelToggle
              collapsed={leftSidebarMode === 'collapsed'}
              onToggle={() => {
                dispatch(toggleLeftSidebarAction())
              }}
            />
          ) : (
            <Logo />
          )}
        </div>
        <div className="pr-4 pl-2 border-r-0 border-gray-200 font-semibold">
          {event.name}
        </div>
      </div>
      <Timer />
      <div className="flex justify-end items-center gap-2 h-full">
        <HelpButton
          buttonProps={{
            variant: 'light',
            className: cn('live-button', {
              active: dyteStates.activeSettings,
            }),
          }}
        />
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
