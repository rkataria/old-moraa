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
        radius: 'md',
        size: 'sm',
        variant: 'flat',
        className: cn(
          'transition-all duration-300 bg-[#F3F4F6] text-[#444444]',
          className
        ),
      }}
      tooltipProps={{
        content: 'Media Setting',
      }}
      onClick={onClick}>
      <IoEllipsisVertical size={20} />
    </ControlButton>
  )
}
