import { useHotkeys } from 'react-hotkeys-hook'
import { TbBubbleText } from 'react-icons/tb'

import { ControlButton } from '../common/ControlButton'

import { cn, KeyboardShortcuts } from '@/utils/utils'

export function NotesToggle({
  isNotesSidebarOpen,
  onClick,
}: {
  isNotesSidebarOpen: boolean
  onClick: () => void
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleShortCut = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
    onClick()
  }
  useHotkeys('n', handleShortCut)

  return (
    <ControlButton
      buttonProps={{
        size: 'md',
        variant: 'light',
        disableRipple: true,
        disableAnimation: true,
        className: cn('live-button', {
          active: isNotesSidebarOpen,
        }),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.notes.label,
        actionKey: KeyboardShortcuts.Live.notes.key,
      }}
      onClick={onClick}>
      <div className="flex flex-col justify-center items-center py-1">
        {isNotesSidebarOpen ? (
          <TbBubbleText size={20} />
        ) : (
          <TbBubbleText size={20} />
        )}
        Note
      </div>
    </ControlButton>
  )
}
