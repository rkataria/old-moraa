import { Tooltip } from '@nextui-org/react'
import { BsSliders } from 'react-icons/bs'

import { Button } from '@/components/ui/Button'
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
        size="sm"
        isIconOnly
        variant="light"
        className={cn('bg-gray-100 hover:bg-gray-200', {
          'bg-primary-100': rightSidebarVisiblity === 'frame-configuration',
        })}
        onClick={toggleSidebar}>
        <BsSliders size={18} />
      </Button>
    </Tooltip>
  )
}
