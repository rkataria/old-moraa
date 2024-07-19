import { Button, Tooltip } from '@nextui-org/react'
import { IoColorPaletteOutline } from 'react-icons/io5'

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
    <Tooltip content="Frame Appearance" placement="left">
      <Button
        isIconOnly
        onClick={toggleSidebar}
        variant="light"
        className={cn('cursor-pointer text-[#52525B]', {
          'text-[#7C3AED]': rightSidebarVisiblity === 'frame-appearance',
        })}>
        <IoColorPaletteOutline size={20} strokeWidth={1.7} />
      </Button>
    </Tooltip>
  )
}
