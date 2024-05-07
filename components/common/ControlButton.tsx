import { Button, ButtonProps } from '@nextui-org/button'
import { Tooltip, TooltipProps } from '@nextui-org/tooltip'

export type MeetingControlButtonProps = {
  children: React.ReactNode
  tooltipProps: TooltipProps
  buttonProps: ButtonProps
  onClick: () => void
}

export function ControlButton({
  children,
  tooltipProps,
  buttonProps,
  onClick,
}: MeetingControlButtonProps) {
  return (
    <Tooltip {...tooltipProps}>
      <Button onClick={onClick} {...buttonProps}>
        {children}
      </Button>
    </Tooltip>
  )
}
