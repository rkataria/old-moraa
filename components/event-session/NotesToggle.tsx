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
  useHotkeys('a', onClick)

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'light',
        className: cn('transition-all duration-300', {
          'bg-black text-white': isNotesSidebarOpen,
        }),
      }}
      tooltipProps={{
        content: isNotesSidebarOpen ? 'Hide Notes' : 'Show Notes',
      }}
      onClick={onClick}>
      <LuClipboardEdit size={20} />
    </ControlButton>
  )
}
