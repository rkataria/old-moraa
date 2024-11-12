import { useHotkeys } from 'react-hotkeys-hook'
import { IoPeople, IoPeopleOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn, KeyboardShortcuts } from '@/utils/utils'

export function ParticipantsToggle({
  isParticipantsSidebarOpen,
  onClick,
}: {
  isParticipantsSidebarOpen: boolean
  onClick: () => void
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleShortCut = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
    onClick()
  }
  useHotkeys('p', handleShortCut)

  return (
    <ControlButton
      buttonProps={{
        size: 'md',
        variant: 'light',
        disableRipple: true,
        disableAnimation: true,
        className: cn('live-button -mx-2', {
          active: isParticipantsSidebarOpen,
        }),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.participants.label,
        actionKey: KeyboardShortcuts.Live.participants.key,
      }}
      onClick={onClick}>
      <div className="flex flex-col justify-center items-center py-1">
        {isParticipantsSidebarOpen ? (
          <IoPeople size={20} />
        ) : (
          <IoPeopleOutline size={20} />
        )}
        People
      </div>
    </ControlButton>
  )
}
