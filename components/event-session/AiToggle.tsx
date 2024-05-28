import { useHotkeys } from 'react-hotkeys-hook'
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
  useHotkeys('a', onClick)

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'light',
        className: cn('transition-all duration-300', {
          'bg-black text-white': isAiSidebarOpen,
        }),
      }}
      tooltipProps={{
        content: isAiSidebarOpen ? 'Close AI Copilot' : 'AI Copilot',
      }}
      onClick={onClick}>
      <IoSparkles size={20} />
    </ControlButton>
  )
}
