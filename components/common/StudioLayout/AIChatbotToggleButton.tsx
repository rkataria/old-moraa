import { useContext } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'
import { LuSparkles } from 'react-icons/lu'

import { Button } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function AIChatbotToggleButton() {
  const { resizableRightSidebarVisiblity, setResizableRightSidebarVisiblity } =
    useStudioLayout()
  const { isOwner } = useContext(EventContext) as EventContextType

  const toggleSidebar = () => {
    if (!isOwner) return

    setResizableRightSidebarVisiblity(
      resizableRightSidebarVisiblity === 'ai-chat' ? null : 'ai-chat'
    )
  }

  useHotkeys('a', toggleSidebar, [resizableRightSidebarVisiblity, isOwner])

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
