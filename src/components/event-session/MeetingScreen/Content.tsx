import { PropsWithChildren, useEffect, useRef, useState } from 'react'

import { Panel, PanelGroup } from 'react-resizable-panels'

import { ContentContainer } from '../ContentContainer'
import { ParticipantTiles } from '../ParticipantTiles'

import { BreakoutMessageBroadcast } from '@/components/common/breakout/BreakoutMessageBroadcast'
import { BreakoutRoomsWithParticipants } from '@/components/common/breakout/BreakoutRoomsWithParticipants'
import { PanelResizer } from '@/components/common/PanelResizer'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreSelector } from '@/hooks/useRedux'
import { EventSessionMode } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function Content() {
  const { eventSessionMode, isHost } = useEventSession()
  const isBreakoutOverviewOpen = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutOverviewOpen
  )
  const sessionBreakoutFrameId = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId
  )
  const currentFrameId = useStoreSelector(
    (state) => state.event.currentEvent.eventState.currentFrameId
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

  const spotlightMode = eventSessionMode === EventSessionMode.LOBBY

  const isCurrentFrameInBreakout =
    typeof currentFrameId === 'string' &&
    currentFrameId === sessionBreakoutFrameId

  const ContentViewModes = {
    spotlight_mode_participants: (
      <div className="flex flex-col overflow-auto h-full flex-1 max-w-screen-xl m-auto">
        <ParticipantTiles spotlightMode />
      </div>
    ),
    frame_presentation_view: (
      <PanelsContent panelRef={panelRef}>
        <div className="relative flex-1 w-full h-full rounded-md overflow-hidden overflow-y-auto scrollbar-none">
          <ContentContainer />
        </div>
      </PanelsContent>
    ),
    frame_peek_view: (
      <PanelsContent panelRef={panelRef}>
        <div className="relative flex-1 w-full h-full rounded-md overflow-hidden overflow-y-auto scrollbar-none">
          <ContentContainer />
        </div>
      </PanelsContent>
    ),
    lobby_breakout_view: (
      <div className="flex flex-col overflow-auto h-full flex-1 max-w-screen-xl m-auto">
        <ParticipantTiles spotlightMode />
      </div>
    ),
    frame_breakout_view: (
      <PanelsContent panelRef={panelRef}>
        <div className="relative flex-1 w-full h-full rounded-md overflow-hidden">
          <h2 className="text-xl font-semibold my-4 mx-2 flex items-center">
            Breakout <BreakoutMessageBroadcast />
          </h2>
          <BreakoutRoomsWithParticipants key="frame_breakout_view" />
        </div>
      </PanelsContent>
    ),
  }

  const contentToShow = cn({
    lobby_breakout_view:
      isHost &&
      isBreakoutActive &&
      !sessionBreakoutFrameId &&
      eventSessionMode !== 'Presentation',
    spotlight_mode_participants: spotlightMode && !isBreakoutOverviewOpen,
    frame_breakout_view:
      isHost &&
      isBreakoutActive &&
      (isBreakoutOverviewOpen || isCurrentFrameInBreakout),
    frame_presentation_view: ['Preview', 'Presentation'].includes(
      eventSessionMode
    ),
    frame_peek_view: eventSessionMode === EventSessionMode.PEEK,
  }).split(' ')[0] as keyof typeof ContentViewModes

  return (
    <div
      className="relative flex justify-start items-start flex-1 w-full h-[calc(100vh_-_120px)] overflow-hidden overflow-y-auto"
      ref={mainContentRef}>
      {/* Sportlight View */}
      {ContentViewModes[contentToShow]}
    </div>
  )
}

function PanelsContent({
  children,
  panelRef,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: PropsWithChildren<{ panelRef: any }>) {
  return (
    <PanelGroup direction="horizontal" autoSaveId="meetingScreenLayout">
      <Panel minSize={30} maxSize={100} defaultSize={80} collapsedSize={50}>
        {children}
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
  )
}
