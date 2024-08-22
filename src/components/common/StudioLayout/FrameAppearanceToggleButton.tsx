import { Button } from '@nextui-org/react'
import { IoColorPaletteOutline } from 'react-icons/io5'

import { Tooltip } from '../ShortuctTooltip'

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
        variant="light"
        className={cn('bg-gray-100 hover:bg-gray-200', {
          'bg-primary-100': rightSidebarVisiblity === 'frame-appearance',
        })}
        onClick={toggleSidebar}>
        <IoColorPaletteOutline size={18} strokeWidth={1.7} />
      </Button>
    </Tooltip>
  )
}
