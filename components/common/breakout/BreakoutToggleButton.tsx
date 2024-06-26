import { IoPeopleOutline } from 'react-icons/io5'

import { ControlButton } from '../ControlButton'

import { cn } from '@/utils/utils'

export function BreakoutToggleButton({
  onClick,
  isActive,
}: {
  onClick: () => void
  isActive: boolean
}) {
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'light',
        className: cn('transition-all duration-300', {
          'bg-black text-white': isActive,
        }),
      }}
      tooltipProps={{
        content: isActive ? 'Hide Breakouts' : 'Show Breakouts',
      }}
      onClick={() => onClick()}>
      <IoPeopleOutline size={20} />
    </ControlButton>
  )
}
