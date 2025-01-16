import { Badge } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'
import { TbBubbleFilled, TbBubbleText } from 'react-icons/tb'
import { useDispatch } from 'react-redux'

import { ControlButton } from '@/components/common/ControlButton'
import { NotesIcon } from '@/components/svg'
import { cn } from '@/components/tiptap/lib/utils'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function NoteToggle() {
  const dispatch = useDispatch()
  const { isHost } = useEventSession()
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)
  const currentFrame = useCurrentFrame()

  const handleNoteToggle = () => {
    if (rightSidebarMode === 'frame-notes') {
      dispatch(closeRightSidebarAction())
    } else {
      if (!currentFrame) {
        toast.error('Select a frame to view notes')

        return
      }

      dispatch(setRightSidebarAction('frame-notes'))
    }
  }

  useHotkeys(KeyboardShortcuts['Studio Mode'].notes.key, handleNoteToggle, {
    ...liveHotKeyProps,
    enabled: isHost,
  })

  if (!isHost) return null

  if (!currentFrame) return null

  const isNotesSidebarOpen = rightSidebarMode === 'frame-notes'

  if (!currentFrame?.notes) {
    return (
      <ControlButton
        buttonProps={{
          size: 'sm',
          variant: 'light',
          disableRipple: true,
          disableAnimation: true,
          className: cn('live-button', {
            active: isNotesSidebarOpen,
          }),
          startContent: (
            <NotesIcon
              className={cn({
                'text-primary': isNotesSidebarOpen,
              })}
            />
          ),
        }}
        tooltipProps={{
          label: KeyboardShortcuts.Live.notes.label,
          actionKey: KeyboardShortcuts.Live.notes.key,
        }}
        onClick={handleNoteToggle}>
        Notes
      </ControlButton>
    )
  }

  return (
    <Badge
      content=""
      color="danger"
      shape="circle"
      placement="top-right"
      hidden={!currentFrame?.notes}>
      <ControlButton
        buttonProps={{
          size: 'md',
          variant: 'light',
          disableRipple: true,
          disableAnimation: true,
          className: cn('live-button -mx-2', {
            active: isNotesSidebarOpen,
          }),
        }}
        tooltipProps={{
          label: KeyboardShortcuts.Live.notes.label,
          actionKey: KeyboardShortcuts.Live.notes.key,
        }}
        onClick={handleNoteToggle}>
        <div className="flex flex-col justify-center items-center py-1">
          {isNotesSidebarOpen ? (
            <TbBubbleFilled size={20} />
          ) : (
            <TbBubbleText size={20} />
          )}
          Note
        </div>
      </ControlButton>
    </Badge>
  )
}
