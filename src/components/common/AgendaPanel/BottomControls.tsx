import { useHotkeys } from 'react-hotkeys-hook'
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu'

import { AddContentButton } from './AddContentButton'

import { Button } from '@/components/ui/Button'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export const BOTTOM_CONTROLS_HEIGHT = 52
export const BOTTOM_CONTROLS_HEIGHT_WHEN_MINIMIZED = 90

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
      className={cn('flex justify-between items-center gap-2', {
        'flex-col py-2': leftSidebarVisiblity === 'minimized',
      })}
      style={{
        height: `${bottomControlsHeight}px`,
      }}>
      <AddContentButton className="flex-auto" />
      <Button size="sm" isIconOnly variant="flat" onClick={toggleLeftSidebar}>
        {leftSidebarVisiblity === 'maximized' ? (
          <LuPanelLeftClose size={18} strokeWidth={1.2} />
        ) : (
          <LuPanelLeftOpen size={18} strokeWidth={1.2} />
        )}
      </Button>
    </div>
  )
}
