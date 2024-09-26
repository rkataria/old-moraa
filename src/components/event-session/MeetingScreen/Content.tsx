import { useEffect, useRef, useState } from 'react'

import { Panel, PanelGroup } from 'react-resizable-panels'

import { ContentContainer } from '../ContentContainer'
import { FrameOverlayView } from '../FrameOverlayView'
import { ParticipantTiles } from '../ParticipantTiles'

import { BreakoutRoomsWithParticipants } from '@/components/common/breakout/BreakoutRoomsFrame'
import { PanelResizer } from '@/components/common/PanelResizer'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreSelector } from '@/hooks/useRedux'
import { EventSessionMode } from '@/types/event-session.type'

export function Content() {
  const { eventSessionMode, isHost } = useEventSession()
  const isBreakoutOverviewOpen = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutOverviewOpen
  )
  const [panelSize, setPanelSize] = useState(18) // Initial default size

  const mainContentRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef(null)
  const { isBreakoutActive } = useBreakoutRooms()

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (panelRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newSize = (panelRef.current as any).getSize() // Get current size as percentage
        if (newSize !== panelSize) {
          setPanelSize(newSize)
        }
      }
    }, 100) // Polling interval

    return () => clearInterval(intervalId)
  }, [panelSize])

  const spotlightMode =
    eventSessionMode === EventSessionMode.LOBBY ||
    (eventSessionMode === EventSessionMode.PEEK && isHost)

  return (
    <div
      className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto"
      ref={mainContentRef}>
      {/* Sportlight View */}
      {spotlightMode && !isBreakoutOverviewOpen ? (
        <div className="flex flex-col overflow-auto h-full flex-1 max-w-screen-lg m-auto">
          <ParticipantTiles spotlightMode />
        </div>
      ) : (
        <PanelGroup direction="horizontal" autoSaveId="meetingScreenLayout">
          <Panel minSize={30} maxSize={100} defaultSize={80} collapsedSize={50}>
            {isHost && isBreakoutActive && isBreakoutOverviewOpen ? (
              <div className="relative flex-1 w-full h-full rounded-md overflow-hidden">
                <h2 className="text-xl font-semibold my-4 mx-2">Breakout</h2>
                <BreakoutRoomsWithParticipants hideActivityCards />
              </div>
            ) : ['Preview', 'Presentation'].includes(eventSessionMode) ? (
              <div className="relative flex-1 w-full h-full rounded-md overflow-hidden overflow-y-auto scrollbar-none bg-white p-2">
                <ContentContainer />
              </div>
            ) : null}
          </Panel>

          <PanelResizer />

          <Panel
            minSize={20}
            collapsedSize={20}
            defaultSize={20}
            maxSize={50}
            ref={panelRef}>
            <div className="flex flex-col overflow-auto h-full flex-1">
              <ParticipantTiles spotlightMode={false} />
            </div>
          </Panel>
        </PanelGroup>
      )}
      <FrameOverlayView />
    </div>
  )
}
