import { useHotkeys } from 'react-hotkeys-hook'
import { LuClipboardEdit } from 'react-icons/lu'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function NotesToggle({
  isNotesSidebarOpen,
  onClick,
}: {
  isNotesSidebarOpen: boolean
  onClick: () => void
}) {
  useHotkeys('n', onClick)

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        size: 'sm',
        variant: 'light',
        className: cn('transition-all duration-300 text-[#444444]', {
          'bg-black text-white hover:bg-black': isNotesSidebarOpen,
        }),
      }}
      tooltipProps={{
        content: isNotesSidebarOpen ? 'Hide Notes' : 'Show Notes',
      }}
      onClick={onClick}>
      <LuClipboardEdit size={20} strokeWidth={1.7} />
    </ControlButton>
  )
}
