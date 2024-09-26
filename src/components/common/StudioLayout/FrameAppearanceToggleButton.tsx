import { MdOutlineDesignServices } from 'react-icons/md'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export function FrameAppearanceToggleButton() {
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  const toggleSidebar = () => {
    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'frame-appearance' ? null : 'frame-appearance'
    )
  }

  return (
    <Tooltip label="Frame Appearance" placement="left">
      <Button
        size="sm"
        isIconOnly
        className={cn({
          'bg-primary-100': rightSidebarVisiblity === 'frame-appearance',
        })}
        onClick={toggleSidebar}>
        <MdOutlineDesignServices size={18} />
      </Button>
    </Tooltip>
  )
}
