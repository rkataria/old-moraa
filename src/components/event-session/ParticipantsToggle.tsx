import { useHotkeys } from 'react-hotkeys-hook'
import { IoPeopleOutline } from 'react-icons/io5'

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
        isIconOnly: true,
        radius: 'md',
        size: 'sm',
        variant: 'light',
        className: cn('transition-all duration-300 text-[#444444]', {
          'bg-black text-white hover:bg-black': isParticipantsSidebarOpen,
        }),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.participants.label,
        actionKey: KeyboardShortcuts.Live.participants.key,
      }}
      onClick={onClick}>
      <IoPeopleOutline size={20} />
    </ControlButton>
  )
}
