import { IoEllipsisVertical } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function MediaSettingsToggle({
  className = '',
  onClick,
}: {
  className?: string
  onClick: () => void
}) {
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'full',
        variant: 'flat',
        className: cn('transition-all duration-300', className),
      }}
      tooltipProps={{
        content: 'Media Setting',
      }}
      onClick={onClick}>
      <IoEllipsisVertical size={16} />
    </ControlButton>
  )
}
