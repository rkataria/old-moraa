/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { ListToggleButton } from './ListToggleButton'
import { OverviewButton } from './OverviewButton'
import { Tooltip } from '../ShortuctTooltip'

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
        <div className="flex items-center justify-between gap-2">
          <OverviewButton label="Home" />
          <div className={cn('flex justify-end items-center gap-2')}>
            <Tooltip
              label={listDisplayMode === 'list' ? 'Grid View' : 'List View'}
              actionKey={listDisplayMode === 'list' ? 'G' : 'L'}
              placement="bottom">
              <div>
                <ListToggleButton
                  listDisplayMode={listDisplayMode}
                  toggleListDisplayMode={toggleListDisplayMode}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      )
    }

    return <OverviewButton />
  }

  return (
    <div
      style={{
        height: `${height}px`,
      }}>
      {renderContent()}
    </div>
  )
}
