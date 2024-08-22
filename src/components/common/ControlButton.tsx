import { ButtonProps } from '@nextui-org/react'

import { Tooltip, TooltipComponentProps } from './ShortuctTooltip'
import { Button } from '../ui/Button'

import { cn } from '@/utils/utils'

export type MeetingControlButtonProps = {
  children: React.ReactNode
  tooltipProps?: TooltipComponentProps
  buttonProps: ButtonProps
  hideTooltip?: boolean
  buttonLabel?: string
  onClick: () => void
}

export function getButtonClassName(isActive: boolean) {
  return cn('flex-none', {
    'bg-black text-white': isActive,
    'bg-white text-black': !isActive,
  })
}

export function ControlButton({
  children,
  tooltipProps,
  buttonProps,
  hideTooltip,
  onClick,
}: MeetingControlButtonProps) {
  if (hideTooltip) {
    return (
      <Button onClick={onClick} {...buttonProps}>
        {children}
      </Button>
    )
  }

  return (
    <Tooltip {...tooltipProps}>
      <Button onClick={onClick} {...buttonProps}>
        {children}
      </Button>
    </Tooltip>
  )
}
