/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react'

import { BsBookmarkFill, BsGrid, BsList } from 'react-icons/bs'

import { Button } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export const HEADER_HEIGHT = 56
export const HEADER_HEIGHT_WHEN_MINIMIZED = 56

export function Header() {
  const { overviewOpen, preview, isOwner, eventMode, setOverviewOpen } =
    useContext(EventContext) as EventContextType
  const { listDisplayMode, toggleListDisplayMode } = useAgendaPanel()
  const { leftSidebarVisiblity } = useStudioLayout()

  const expanded = leftSidebarVisiblity === 'maximized'

  const height = expanded ? HEADER_HEIGHT : HEADER_HEIGHT_WHEN_MINIMIZED

  const handleOverviewClick = () => {
    if (!isOwner) return
    if (preview) return
    if (eventMode !== 'edit') return

    setOverviewOpen(true)
  }

  const renderContent = () => {
    if (expanded) {
      return (
        <>
          <div
            className={cn(
              'flex-auto p-2 rounded-md flex justify-start items-center gap-2 cursor-pointer hover:bg-purple-200',
              {
                'bg-purple-200': overviewOpen,
              }
            )}
            onClick={handleOverviewClick}>
            <BsBookmarkFill size={18} />
            <span className="font-semibold">Overview</span>
          </div>
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
      <div className={cn('flex flex-col justify-center items-center gap-2')}>
        <Button
          size="md"
          variant={overviewOpen ? 'flat' : 'light'}
          className={cn('cursor-pointer hover:bg-purple-200', {
            'bg-purple-200': overviewOpen,
          })}
          isIconOnly
          onClick={handleOverviewClick}>
          <BsBookmarkFill size={18} />
        </Button>
        {/* <Button size="md" variant="flat" isIconOnly>
          <BsSearch size={18} />
        </Button> */}
        {/* <Button
          size="md"
          variant="flat"
          isIconOnly
          onClick={toggleListDisplayMode}>
          {listDisplayMode === 'list' ? (
            <BsGrid size={18} />
          ) : (
            <BsList size={18} />
          )}
        </Button> */}
      </div>
    )
  }

  return (
    <div
      className="flex justify-between items-center gap-2 px-2"
      style={{
        height: `${height}px`,
      }}>
      {renderContent()}
    </div>
  )
}
