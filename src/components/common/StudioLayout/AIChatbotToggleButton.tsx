import { useHotkeys } from 'react-hotkeys-hook'
import { HiSparkles } from 'react-icons/hi2'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useFlags } from '@/flags/client'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightResizableSidebarAction } from '@/stores/slices/layout/studio.slice'

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
        color="primary"
        className="!bg-transparent">
        <HiSparkles size={24} className="hover:text-yellow-500" />
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
