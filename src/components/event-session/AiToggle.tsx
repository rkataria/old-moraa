import { useHotkeys } from 'react-hotkeys-hook'
import { IoSparklesOutline } from 'react-icons/io5'

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
        size: 'sm',
        variant: 'light',
        className: cn('transition-all duration-300 text-[#444444]', {
          'bg-black text-white hover:bg-black': isAiSidebarOpen,
        }),
      }}
      tooltipProps={{
        content: isAiSidebarOpen ? 'Close AI Copilot' : 'AI Copilot',
      }}
      onClick={onClick}>
      <IoSparklesOutline size={20} />
    </ControlButton>
  )
}
