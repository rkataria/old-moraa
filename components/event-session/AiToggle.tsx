import { IoSparkles } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function AiToggle({
  isAiSidebarOpen,
  onClick,
}: {
  isAiSidebarOpen: boolean
  onClick: () => void
}) {
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'full',
        variant: 'flat',
        className: cn('transition-all duration-300', {
          'bg-black text-white': isAiSidebarOpen,
        }),
      }}
      tooltipProps={{
        content: isAiSidebarOpen ? 'Close AI Sidebar' : 'Talk AI',
      }}
      onClick={onClick}>
      <IoSparkles size={16} />
    </ControlButton>
  )
}
