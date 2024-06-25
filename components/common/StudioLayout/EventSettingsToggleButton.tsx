import { LuSettings } from 'react-icons/lu'

import { Button, Tooltip } from '@nextui-org/react'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export function EventSettingsToggleButton() {
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  const toggleSidebar = () => {
    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'event-settings' ? null : 'event-settings'
    )
  }

  return (
    <Tooltip content="Event Settings" placement="left">
      <Button
        isIconOnly
        onClick={toggleSidebar}
        variant="light"
        className={cn('cursor-pointer text-[#52525B]', {
          'text-[#7C3AED]': rightSidebarVisiblity === 'frame-appearance',
        })}>
        <LuSettings size={20} />
      </Button>
    </Tooltip>
  )
}
