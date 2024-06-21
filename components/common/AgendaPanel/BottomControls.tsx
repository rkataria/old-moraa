import { useHotkeys } from 'react-hotkeys-hook'
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu'

import { Button } from '@nextui-org/react'

import { AddContentButton } from './AddContentButton'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export const BOTTOM_CONTROLS_HEIGHT = 52
export const BOTTOM_CONTROLS_HEIGHT_WHEN_MINIMIZED = 104

export function BottomControls() {
  const { leftSidebarVisiblity, toggleLeftSidebar } = useStudioLayout()

  const bottomControlsHeight =
    leftSidebarVisiblity === 'minimized'
      ? BOTTOM_CONTROLS_HEIGHT_WHEN_MINIMIZED
      : BOTTOM_CONTROLS_HEIGHT

  useHotkeys(
    'ctrl + [',
    toggleLeftSidebar,
    {
      enableOnFormTags: ['INPUT', 'TEXTAREA'],
    },
    [toggleLeftSidebar]
  )

  return (
    <div
      className={cn('px-2 flex justify-between items-center gap-2', {
        'flex-col py-2': leftSidebarVisiblity === 'minimized',
      })}
      style={{
        height: `${bottomControlsHeight}px`,
      }}>
      <AddContentButton className="flex-auto" />
      <Button isIconOnly variant="ghost" onClick={toggleLeftSidebar}>
        {leftSidebarVisiblity === 'maximized' ? (
          <LuPanelLeftClose size={18} />
        ) : (
          <LuPanelLeftOpen size={18} />
        )}
      </Button>
    </div>
  )
}
