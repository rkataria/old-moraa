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
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'full',
        variant: 'flat',
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
      <IoPeopleSharp size={16} />
    </ControlButton>
  )
}
