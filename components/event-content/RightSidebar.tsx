import { useContext } from 'react'

import { useParams } from 'next/navigation'

import { SettingsSidebar } from './SettingsSidebar'
import { AIChat } from '../common/AIChat'
import { EditEventForm } from '../common/EditEventForm'
import { NoteOverlay } from '../common/NotesOverlay'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'

export function RightSidebar() {
  const { eventId } = useParams()
  const { currentSlide, overviewOpen, preview, isOwner } = useContext(
    EventContext
  ) as EventContextType
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  if (preview || !isOwner) return null
  if (rightSidebarVisiblity === 'ai-chat') {
    return <AIChat onClose={() => setRightSidebarVisiblity(null)} />
  }
  if (rightSidebarVisiblity === 'notes') {
    return <NoteOverlay onClose={() => setRightSidebarVisiblity(null)} />
  }
  if (currentSlide && rightSidebarVisiblity === 'slide-settings') {
    return (
      <SettingsSidebar
        settingsEnabled
        onClose={() => setRightSidebarVisiblity(null)}
      />
    )
  }

  if (overviewOpen) {
    return (
      <div className="p-4">
        <h3 className="mb-2 font-bold">Event Details</h3>
        <EditEventForm eventId={eventId as string} />
      </div>
    )
  }

  return null
}
