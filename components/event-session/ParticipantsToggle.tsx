import { useHotkeys } from 'react-hotkeys-hook'
import { IoPeopleSharp } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function ParticipantsToggle({
  isParticipantsSidebarOpen,
  onClick,
}: {
  isParticipantsSidebarOpen: boolean
  onClick: () => void
}) {
  useHotkeys('p', onClick)

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'light',
        className: cn('transition-all duration-300', {
          'bg-black text-white': isParticipantsSidebarOpen,
        }),
      }}
      tooltipProps={{
        content: isParticipantsSidebarOpen
          ? 'Hide Participants'
          : 'Show Participants',
      }}
      onClick={onClick}>
      <IoPeopleSharp size={20} />
    </ControlButton>
  )
}
