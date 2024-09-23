import { BsSliders } from 'react-icons/bs'

import { Tooltip } from '../ShortuctTooltip'

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
    <Tooltip label="Frame Configuration" placement="left">
      <Button
        size="sm"
        isIconOnly
        className={cn({
          'bg-primary-100': rightSidebarVisiblity === 'frame-configuration',
        })}
        onClick={toggleSidebar}>
        <BsSliders size={18} />
      </Button>
    </Tooltip>
  )
}
