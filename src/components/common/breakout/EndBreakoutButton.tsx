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
        className: cn('gap-2 justify-between bg-red-500 text-white'),
      }}
      onClick={() => onEndBreakoutClick?.()}>
      End planned breakout
    </ControlButton>
  )
}
