import { useEffect, useRef, useState } from 'react'

import { Panel, PanelGroup } from 'react-resizable-panels'

import { ContentContainer } from './ContentContainer'
import { ParticipantTiles } from './ParticipantTiles'
import { BreakoutRoomsWithParticipants } from '../common/breakout/BreakoutRoomsFrame'
import { PanelResizer } from '../common/PanelResizer'

import { useBreakoutRooms } from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'

export function MainContainer() {
  const {
    presentationStatus,
    currentFrame,
    eventSessionMode,
    isBreakoutSlide,
    isHost,
  } = useEventSession()
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

  const spotlightMode = eventSessionMode === 'Lobby'

  const currentFrameBgColor =
    presentationStatus === PresentationStatuses.STARTED && !isBreakoutSlide
      ? currentFrame?.config?.backgroundColor || '#ffffff'
      : '#ffffff'

  if (mainContentRef.current) {
    mainContentRef.current.style.backgroundColor = currentFrameBgColor
  }

  return (
    <div
      className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto bg-white"
      ref={mainContentRef}>
      {/* Sportlight View */}
      {spotlightMode && !isBreakoutSlide ? (
        <div className="flex flex-col overflow-auto h-full flex-1">
          <ParticipantTiles spotlightMode />
        </div>
      ) : (
        <PanelGroup direction="horizontal" autoSaveId="meetingScreenLayout">
          <Panel minSize={30} maxSize={100} defaultSize={80} collapsedSize={50}>
            {isHost && isBreakoutActive && isBreakoutSlide ? (
              <div className="relative flex-1 w-full h-full p-2 rounded-md overflow-hidden">
                <h2 className="text-xl font-semibold my-4 mx-2">
                  Breakout Time!
                </h2>
                <BreakoutRoomsWithParticipants hideActivityCards />
              </div>
            ) : ['Preview', 'Presentation'].includes(eventSessionMode) ? (
              <div className="relative flex-1 w-full h-full p-2 rounded-md overflow-hidden overflow-y-auto">
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
