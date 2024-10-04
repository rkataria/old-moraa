import { useContext, useEffect } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { FrameAppearance } from './FrameAppearance/FrameAppearance'
import { NoteOverlay } from '../common/NotesOverlay'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'

export function RightSidebar() {
  const { currentFrame, eventMode, preview } = useContext(
    EventContext
  ) as EventContextType
  const { permissions } = useEventPermissions()

  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  useHotkeys('ctrl + ]', () => setRightSidebarVisiblity(null), {
    enableOnFormTags: ['INPUT', 'TEXTAREA'],
  })

  const editable =
    permissions.canUpdateFrame && eventMode === 'edit' && !preview

  useEffect(() => {
    if (!rightSidebarVisiblity) return

    if (!editable) {
      setRightSidebarVisiblity(null) // Hide the right sidebar if it is not editable
    }

    if (!currentFrame?.id) {
      setRightSidebarVisiblity(null)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, currentFrame?.id, rightSidebarVisiblity])

  const renderContent = () => {
    switch (rightSidebarVisiblity) {
      case 'frame-appearance':
        return <FrameAppearance />

      case 'frame-notes':
        return (
          <NoteOverlay
            editable={permissions.canUpdateNotes}
            onClose={() => {
              setRightSidebarVisiblity(null)
            }}
          />
        )
      default:
        break
    }

    return null
  }

  return <>{renderContent()}</>
}
