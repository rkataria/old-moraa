/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { BsGrid, BsList } from 'react-icons/bs'

import { Button } from '@nextui-org/react'

import { OverviewButton } from './OverviewButton'

import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export const HEADER_HEIGHT = 56
export const HEADER_HEIGHT_WHEN_MINIMIZED = 56

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
            {/* <Button size="sm" variant="flat" isIconOnly>
              <BsSearch size={18} />
            </Button> */}
            <Button
              size="md"
              variant="flat"
              isIconOnly
              onClick={toggleListDisplayMode}>
              {listDisplayMode === 'list' ? (
                <BsGrid size={18} />
              ) : (
                <BsList size={18} />
              )}
            </Button>
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
      className="flex justify-between items-center gap-2 px-1"
      style={{
        height: `${height}px`,
      }}>
      {renderContent()}
    </div>
  )
}
