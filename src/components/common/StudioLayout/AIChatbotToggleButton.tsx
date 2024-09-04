import { useContext } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'
import { LuSparkles } from 'react-icons/lu'

import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { useFlags } from '@/flags/client'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function ToggleButton() {
  const { resizableRightSidebarVisiblity, setResizableRightSidebarVisiblity } =
    useStudioLayout()

  const toggleSidebar = () => {
    setResizableRightSidebarVisiblity(
      resizableRightSidebarVisiblity === 'ai-chat' ? null : 'ai-chat'
    )
  }

  useHotkeys('a', toggleSidebar, [resizableRightSidebarVisiblity])

  return (
    <Button
      size="sm"
      isIconOnly
      onClick={toggleSidebar}
      variant="light"
      className={cn('cursor-pointer', {
        'text-primary': resizableRightSidebarVisiblity === 'ai-chat',
      })}>
      <LuSparkles size={18} strokeWidth={1.7} />
    </Button>
  )
}

export function AIChatbotToggleButton() {
  const { preview } = useContext(EventContext) as EventContextType

  const { flags } = useFlags()

  const { permissions } = useEventPermissions()

  if (!flags?.show_ai_panel) return null

  if (!permissions.canUpdateFrame) {
    return null
  }

  if (preview) return null

  return <ToggleButton />
}
