import { useContext, useEffect } from 'react'

import { useParams } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'

import { FrameAppearance } from './FrameAppearance/FrameAppearance'
import { FrameConfiguration } from './FrameConfiguration/FrameConfiguration'
import { EditEventForm } from '../common/EditEventForm'
import { NoteOverlay } from '../common/NotesOverlay'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'

export function RightSidebar() {
  const { eventId } = useParams()
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

    if (!currentFrame?.id && rightSidebarVisiblity !== 'event-settings') {
      setRightSidebarVisiblity(null)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, currentFrame?.id, rightSidebarVisiblity])

  if (!editable) {
    return null
  }

  const renderContent = () => {
    switch (rightSidebarVisiblity) {
      case 'frame-appearance':
        return <FrameAppearance />
      case 'frame-configuration':
        return <FrameConfiguration />
      case 'frame-notes':
        return <NoteOverlay editable={permissions.canUpdateNotes} />
      case 'event-settings':
        return (
          <div className="p-4">
            <h3 className="mb-2 font-bold">Event Details</h3>
            <EditEventForm eventId={eventId as string} />
          </div>
        )
      default:
        break
    }

    return null
  }

  return <>{renderContent()}</>
}
