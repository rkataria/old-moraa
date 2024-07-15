import { ControlButton } from '../../ControlButton'

import { cn } from '@/utils/utils'

type HeaderButtonProps = {
  tooltipContent: string
  label: string
  icon: React.ReactNode
  hideTooltip?: boolean
  active?: boolean
  disabled?: boolean
  onClick: () => void
}

export function HeaderButton({
  tooltipContent,
  label,
  icon,
  hideTooltip,
  active,
  disabled,
  onClick,
}: HeaderButtonProps) {
  return (
    <ControlButton
      tooltipProps={{
        content: tooltipContent,
      }}
      buttonProps={{
        variant: 'light',
        size: 'lg',
        radius: 'md',
        isIconOnly: true,
        disabled,
        className: cn('flex-none flex flex-col items-center justify-center', {
          'bg-black text-white hover:bg-black hover:text-white': active,
        }),
      }}
      hideTooltip={hideTooltip}
      onClick={onClick}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </ControlButton>
  )
}
