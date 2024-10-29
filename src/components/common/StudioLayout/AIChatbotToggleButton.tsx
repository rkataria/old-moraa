import { useContext } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'
import { LuSparkles } from 'react-icons/lu'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { useFlags } from '@/flags/client'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightResizableSidebarAction } from '@/stores/slices/layout/studio.slice'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function ToggleButton() {
  const dispatch = useStoreDispatch()

  const resizableRightSidebarVisibility = useStoreSelector(
    (state) => state.layout.studio.contentStudioRightResizableSidebar
  )

  const toggleSidebar = () => {
    dispatch(
      setContentStudioRightResizableSidebarAction(
        resizableRightSidebarVisibility === 'ai-chat' ? null : 'ai-chat'
      )
    )
  }

  useHotkeys('a', toggleSidebar, [resizableRightSidebarVisibility])

  return (
    <Tooltip label="ChatGPT 4o Co-pilot" actionKey="A">
      <Button
        size="sm"
        isIconOnly
        onClick={toggleSidebar}
        variant="light"
        className={cn('cursor-pointer', {
          'text-primary': resizableRightSidebarVisibility === 'ai-chat',
        })}>
        <LuSparkles size={18} strokeWidth={1.2} />
      </Button>
    </Tooltip>
  )
}

export function AIChatbotToggleButton() {
  const { preview } = useContext(EventContext) as EventContextType

  const { flags } = useFlags()

  const { permissions } = useEventPermissions()

  const activeTab = useStoreSelector((state) => state.layout.studio.activeTab)

  if (!flags?.show_ai_panel) return null

  if (!permissions.canUpdateFrame) {
    return null
  }

  if (preview) return null
  if (activeTab !== 'content-studio') return null

  return <ToggleButton />
}
