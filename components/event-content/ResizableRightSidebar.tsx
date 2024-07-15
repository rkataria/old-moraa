import { useContext } from 'react'

import { AIChat } from '../common/AIChat'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'

export function ResizableRightSidebar() {
  const { preview } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()

  const { resizableRightSidebarVisiblity, setResizableRightSidebarVisiblity } =
    useStudioLayout()

  if (preview || !permissions.canUpdateFrame) return null

  if (resizableRightSidebarVisiblity === 'ai-chat') {
    return <AIChat onClose={() => setResizableRightSidebarVisiblity(null)} />
  }

  return null
}
