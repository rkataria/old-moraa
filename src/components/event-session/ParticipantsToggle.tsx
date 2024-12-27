import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { BsPeople, BsPeopleFill } from 'react-icons/bs'

import { ControlButton } from '../common/ControlButton'

import { cn, KeyboardShortcuts } from '@/utils/utils'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleShortCut = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
    onClick()
  }
  useHotkeys('p', handleShortCut)

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
        startContent: isParticipantsSidebarOpen ? (
          <BsPeopleFill size={18} />
        ) : (
          <BsPeople
            size={18}
            className={cn({
              'animate-pulse fill-red-500': areParticipantsWaitingInLobby,
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
