import { useEffect } from 'react'

import { Badge } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'

import { Tooltip } from '@/components/common/ShortuctTooltip'
import { cn } from '@/components/tiptap/lib/utils'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { KeyboardShortcuts } from '@/utils/utils'

export function NoteToggle() {
  const dispatch = useDispatch()
  const { isHost } = useEventSession()
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)
  const currentFrame = useCurrentFrame()

  useEffect(() => {
    if (currentFrame?.notes) {
      dispatch(setRightSidebarAction('frame-notes'))
    }
  }, [currentFrame?.notes, dispatch])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNoteToggle = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
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
    enabled: isHost,
  })

  if (!isHost) return null

  return (
    <Tooltip label="Notes" actionKey="N" placement="top">
      {currentFrame?.notes ? (
        <Badge
          content=""
          color="danger"
          shape="circle"
          placement="top-right"
          hidden={!currentFrame?.notes}>
          <Button
            size="sm"
            variant="light"
            className={cn('live-button', {
              active: rightSidebarMode === 'frame-notes',
            })}
            onClick={handleNoteToggle}>
            Note
          </Button>
        </Badge>
      ) : (
        <Button
          size="sm"
          variant="light"
          className={cn('live-button', {
            active: rightSidebarMode === 'frame-notes',
          })}
          onClick={handleNoteToggle}>
          Note
        </Button>
      )}
    </Tooltip>
  )
}
