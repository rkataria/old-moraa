import { useHotkeys } from 'react-hotkeys-hook'
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu'

import { AddContentButton } from './AddContentButton'
import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn, KeyboardShortcuts } from '@/utils/utils'

export const BOTTOM_CONTROLS_HEIGHT = 52
export const BOTTOM_CONTROLS_HEIGHT_WHEN_MINIMIZED = 90

export function BottomControls() {
  const { leftSidebarVisiblity, toggleLeftSidebar } = useStudioLayout()

  const bottomControlsHeight =
    leftSidebarVisiblity === 'minimized'
      ? BOTTOM_CONTROLS_HEIGHT_WHEN_MINIMIZED
      : BOTTOM_CONTROLS_HEIGHT

  useHotkeys(
    KeyboardShortcuts['Agenda Panel'].expandAndCollapse.key,
    toggleLeftSidebar,
    {
      enableOnFormTags: ['INPUT', 'TEXTAREA'],
    },
    [toggleLeftSidebar]
  )

  const leftSideBarMaximized = leftSidebarVisiblity === 'maximized'

  return (
    <div
      className={cn('flex justify-between items-center gap-2', {
        'flex-col py-2': leftSidebarVisiblity === 'minimized',
      })}
      style={{
        height: `${bottomControlsHeight}px`,
      }}>
      <AddContentButton className="flex-auto" />
      <Tooltip
        label={leftSideBarMaximized ? 'Collapse' : 'Expand'}
        actionKey={KeyboardShortcuts['Agenda Panel'].expandAndCollapse.key}
        systemKeys={['ctrl']}>
        <Button size="sm" isIconOnly variant="flat" onClick={toggleLeftSidebar}>
          {leftSidebarVisiblity === 'maximized' ? (
            <LuPanelLeftClose size={18} strokeWidth={1.2} />
          ) : (
            <LuPanelLeftOpen size={18} strokeWidth={1.2} />
          )}
        </Button>
      </Tooltip>
    </div>
  )
}
