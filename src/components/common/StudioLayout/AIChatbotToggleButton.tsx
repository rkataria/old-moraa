import { useHotkeys } from 'react-hotkeys-hook'
import { IoSparklesSharp } from 'react-icons/io5'

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
        variant="bordered"
        color="primary"
        className="cursor-pointer active !bg-gradient-to-br from-primary/10 to-white border-1">
        <IoSparklesSharp size={18} strokeWidth={1.2} />
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
