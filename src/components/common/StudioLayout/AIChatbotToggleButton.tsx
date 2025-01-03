import { useHotkeys } from 'react-hotkeys-hook'
import { LuSparkles } from 'react-icons/lu'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useFlags } from '@/flags/client'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightResizableSidebarAction } from '@/stores/slices/layout/studio.slice'
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
        className={cn('cursor-pointer studio-button', {
          active: resizableRightSidebarVisibility === 'ai-chat',
        })}>
        <LuSparkles size={18} strokeWidth={1.2} />
      </Button>
    </Tooltip>
  )
}

export function AIChatbotToggleButton() {
  const { flags } = useFlags()

  const { permissions } = useEventPermissions()

  if (!flags?.show_ai_panel) return null

  if (!permissions.canUpdateFrame) {
    return null
  }

  return <ToggleButton />
}
