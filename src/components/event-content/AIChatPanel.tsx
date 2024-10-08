import { useContext } from 'react'

import { AIChat } from '../common/AIChat'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightResizableSidebarAction } from '@/stores/slices/layout/studio.slice'
import { EventContextType } from '@/types/event-context.type'

export function AIChatPanel() {
  const { preview } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()
  const dispatch = useStoreDispatch()
  const resizableRightSidebarVisible = useStoreSelector(
    (state) => state.layout.studio.contentStudioRightResizableSidebar
  )

  if (preview || !permissions.canUpdateFrame) return null

  if (resizableRightSidebarVisible === 'ai-chat') {
    return (
      <AIChat
        onClose={() =>
          dispatch(setContentStudioRightResizableSidebarAction(null))
        }
      />
    )
  }

  return null
}
