import { useContext } from 'react'

import { AIChat } from '../common/AIChat'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'

export function ResizableRightSidebar() {
  const { preview, isOwner } = useContext(EventContext) as EventContextType
  const { resizableRightSidebarVisiblity, setResizableRightSidebarVisiblity } =
    useStudioLayout()

  if (preview || !isOwner) return null

  if (resizableRightSidebarVisiblity === 'ai-chat') {
    return <AIChat onClose={() => setResizableRightSidebarVisiblity(null)} />
  }

  return null
}
