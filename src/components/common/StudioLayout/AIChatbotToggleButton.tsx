import { Button } from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { LuSparkles } from 'react-icons/lu'

import { useFlags } from '@/flags/client'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
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
      isIconOnly
      onClick={toggleSidebar}
      variant="light"
      className={cn('cursor-pointer text-[#52525B]', {
        'text-[#7C3AED]': resizableRightSidebarVisiblity === 'ai-chat',
      })}>
      <LuSparkles size={20} strokeWidth={1.7} />
    </Button>
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
