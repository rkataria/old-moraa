/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { ListToggleButton } from './ListToggleButton'
import { OverviewButton } from './OverviewButton'

import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export const HEADER_HEIGHT = 40
export const HEADER_HEIGHT_WHEN_MINIMIZED = 40

export function Header() {
  const { listDisplayMode, toggleListDisplayMode } = useAgendaPanel()
  const { leftSidebarVisiblity } = useStudioLayout()

  const expanded = leftSidebarVisiblity === 'maximized'

  const height = expanded ? HEADER_HEIGHT : HEADER_HEIGHT_WHEN_MINIMIZED

  const renderContent = () => {
    if (expanded) {
      return (
        <>
          <OverviewButton label="Overview" />
          <div className={cn('flex justify-end items-center gap-2')}>
            <ListToggleButton
              listDisplayMode={listDisplayMode}
              toggleListDisplayMode={toggleListDisplayMode}
            />
          </div>
        </>
      )
    }

    return (
      <div
        className={cn(
          'flex flex-col justify-center items-center gap-2 w-full'
        )}>
        <OverviewButton />
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-between gap-2 px-1"
      style={{
        height: `${height}px`,
      }}>
      {renderContent()}
    </div>
  )
}
