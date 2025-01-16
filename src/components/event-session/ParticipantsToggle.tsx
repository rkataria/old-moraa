import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'

import { ControlButton } from '../common/ControlButton'
import { UsersIcon } from '../svg'

import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function ParticipantsToggle({
  isParticipantsSidebarOpen,
  onClick,
}: {
  isParticipantsSidebarOpen: boolean
  onClick: () => void
}) {
  const areParticipantsWaitingInLobby = useDyteSelector(
    (state) => !!state.participants.waitlisted.size
  )
  const handleShortCut = () => {
    onClick()
  }

  useHotkeys('p', handleShortCut, liveHotKeyProps)

  return (
    <ControlButton
      buttonProps={{
        size: 'sm',
        variant: 'light',
        disableRipple: true,
        disableAnimation: true,
        className: cn('live-button', {
          active: isParticipantsSidebarOpen,
        }),
        startContent: (
          <UsersIcon
            filled={isParticipantsSidebarOpen || areParticipantsWaitingInLobby}
            className={cn({
              'animate-pulse text-red-500': areParticipantsWaitingInLobby,
            })}
          />
        ),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.participants.label,
        actionKey: KeyboardShortcuts.Live.participants.key,
      }}
      onClick={onClick}>
      People
    </ControlButton>
  )
}
