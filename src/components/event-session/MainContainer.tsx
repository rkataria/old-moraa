import { useEffect, useRef, useState } from 'react'

import { Panel, PanelGroup } from 'react-resizable-panels'

import { ContentContainer } from './ContentContainer'
import { ParticipantTiles } from './ParticipantTiles'
import { PanelResizer } from '../common/PanelResizer'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { EventSessionMode } from '@/types/event-session.type'

export function MainContainer() {
  const { eventSessionMode, isHost } = useEventSession()
  const isBreakoutOverviewOpen = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutOverviewOpen
  )
  const [panelSize, setPanelSize] = useState(18) // Initial default size

  const mainContentRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef(null)

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
        <div className="flex flex-col overflow-auto h-full flex-1 max-w-screen-xl m-auto">
          <ParticipantTiles spotlightMode />
        </div>
      ) : (
        <PanelGroup direction="horizontal" autoSaveId="meetingScreenLayout">
          <Panel minSize={30} maxSize={100} defaultSize={80} collapsedSize={50}>
            {['Preview', 'Presentation'].includes(eventSessionMode) ? (
              <div className="relative flex-1 w-full h-full p-2 rounded-md overflow-hidden overflow-y-auto scrollbar-none">
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
    </div>
  )
}
