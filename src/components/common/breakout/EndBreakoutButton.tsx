import { ControlButton } from '../ControlButton'

import { cn } from '@/utils/utils'

export function EndBreakoutButton({
  onEndBreakoutClick,
}: {
  onEndBreakoutClick: () => void
}) {
  return (
    <ControlButton
      tooltipProps={{
        content: 'End planned breakout',
      }}
      buttonProps={{
        size: 'sm',
        variant: 'solid',
        // isIconOnly: true,
        className: cn(
          'gap-2 justify-between live-button !text-white !bg-red-500 hover:!bg-red-500'
        ),
      }}
      onClick={() => onEndBreakoutClick?.()}>
      End planned breakout
    </ControlButton>
  )
}
