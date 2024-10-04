/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { AgendaPanelToggle } from './AgendaPanelToggle'
import { ListViewToggle } from './ListViewToggle'

import { PresentationToggle } from '@/components/event-session/PresentationToggle'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { toggleLeftSidebarAction } from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export const HEADER_HEIGHT = 80
export const HEADER_HEIGHT_WHEN_MINIMIZED = 40

export function LiveAgendaHeader() {
  const dispatch = useStoreDispatch()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)

  const isMaximized = leftSidebarMode === 'maximized'

  const height = isMaximized ? `${HEADER_HEIGHT}px` : 'auto'

  const toggleLeftSidebar = () => {
    dispatch(toggleLeftSidebarAction())
  }

  return (
    <div
      style={{
        height,
      }}>
      <div
        className={cn('flex flex-col', {
          'flex-col gap-4': isMaximized,
          'flex-row gap-2': !isMaximized,
        })}>
        <div className="flex items-center justify-between gap-2">
          {isMaximized && (
            <span className="text-base font-semibold">Agenda</span>
          )}
          <div className={cn('flex justify-end items-center gap-2')}>
            {isMaximized && <ListViewToggle />}
            <AgendaPanelToggle
              collapsed={leftSidebarMode === 'collapsed'}
              onToggle={toggleLeftSidebar}
            />
          </div>
        </div>
        <PresentationToggle />
      </div>
    </div>
  )
}
