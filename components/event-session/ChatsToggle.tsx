import { IoChatbubblesSharp } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function ChatsToggle({
  isChatsSidebarOpen,
  onClick,
}: {
  isChatsSidebarOpen: boolean
  onClick: () => void
}) {
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'light',
        className: cn('transition-all duration-300', {
          'bg-black text-white': isChatsSidebarOpen,
        }),
      }}
      tooltipProps={{
        content: isChatsSidebarOpen ? 'Hide Chats' : 'Show Chats',
      }}
      onClick={onClick}>
      <IoChatbubblesSharp size={20} />
    </ControlButton>
  )
}
