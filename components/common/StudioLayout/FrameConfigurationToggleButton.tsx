import { BsSliders } from 'react-icons/bs'

import { Button, Tooltip } from '@nextui-org/react'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export function FrameConfigurationToggleButton() {
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  const toggleSidebar = () => {
    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'frame-configuration'
        ? null
        : 'frame-configuration'
    )
  }

  return (
    <Tooltip content="Frame Configuration" placement="left">
      <Button
        isIconOnly
        onClick={toggleSidebar}
        variant="light"
        className={cn('cursor-pointer text-[#52525B]', {
          'text-[#7C3AED]': rightSidebarVisiblity === 'frame-configuration',
        })}>
        <BsSliders size={18} />
      </Button>
    </Tooltip>
  )
}
