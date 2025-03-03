import { ControlButton } from '@/components/common/ControlButton'
import { cn } from '@/utils/utils'

type HeaderButtonProps = {
  tooltipContent: string
  label: string
  size?: 'lg' | 'sm'
  icon: React.ReactNode
  hideTooltip?: boolean
  active?: boolean
  disabled?: boolean
  onClick: () => void
}

export function HeaderButton({
  tooltipContent,
  label,
  size = 'lg',
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
        size,
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
      {label && <span className="text-xs mt-1">{label}</span>}
    </ControlButton>
  )
}
