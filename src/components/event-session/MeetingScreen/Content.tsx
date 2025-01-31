import { PropsWithChildren, useRef } from 'react'

import { Panel, PanelGroup } from 'react-resizable-panels'

import { SportlightOverlayView } from './SportlightOverlayView'
import { ContentContainer } from '../ContentContainer'
import { ParticipantTiles } from '../ParticipantTiles'

import { BreakoutMessageBroadcast } from '@/components/common/breakout/BreakoutMessageBroadcast'
import { BreakoutRoomsWithParticipants } from '@/components/common/breakout/BreakoutRoomsWithParticipants'
import { PanelResizer } from '@/components/common/PanelResizer'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreSelector } from '@/hooks/useRedux'
import { ContentTilesLayout } from '@/stores/slices/layout/live.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export const TOPBAR_PARTICIPANT_TILES_HEIGHT = 128

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
  const layout = useStoreSelector(
    (state) => state.layout.live.contentTilesLayoutConfig.layout
  )

  const mainContentRef = useRef<HTMLDivElement>(null)
  const { isBreakoutActive } = useBreakoutRooms()

  const spotlightMode = eventSessionMode === EventSessionMode.LOBBY

  const isCurrentFrameInBreakout =
    typeof currentFrameId === 'string' &&
    currentFrameId === sessionBreakoutFrameId

  const ContentViewModes = {
    spotlight_overlay_view: <SportlightOverlayView />,
    spotlight_mode_participants: (
      <div className="flex flex-col overflow-auto h-full flex-1 max-w-screen-xl m-auto">
        <ParticipantTiles spotlightMode />
      </div>
    ),
    frame_presentation_view: (
      <PanelsContent>
        <div className="relative flex-1 w-full h-full rounded-md overflow-hidden overflow-y-auto scrollbar-none">
          <ContentContainer />
        </div>
      </PanelsContent>
    ),
    frame_peek_view: (
      <PanelsContent>
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
      <PanelsContent>
        <div className="relative flex-1 w-full h-full rounded-md overflow-hidden">
          <div className="text-xl font-semibold py-4 mb-4 mx-2 flex items-center justify-between border-b border-gray-300">
            <h3>Breakout</h3>
            <BreakoutMessageBroadcast />
          </div>
          <div className="overflow-y-auto h-[80%]">
            <BreakoutRoomsWithParticipants key="frame_breakout_view" />
          </div>
        </div>
      </PanelsContent>
    ),
  }

  const contentToShow = cn({
    spotlight_overlay_view:
      layout === ContentTilesLayout.Spotlight &&
      eventSessionMode === 'Presentation',
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
      className={cn(
        'relative flex justify-start items-start flex-1 w-full h-[calc(100vh_-_120px)] overflow-hidden overflow-y-auto',
        {
          'max-h-[calc(100vh_-_120px)] overflow-hidden':
            layout === ContentTilesLayout.Topbar,
        }
      )}
      ref={mainContentRef}>
      {/* Sportlight View */}
      {ContentViewModes[contentToShow]}
    </div>
  )
}

function PanelsContent({
  children,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: PropsWithChildren) {
  const contentTilesLayout = useStoreSelector(
    (store) => store.layout.live.contentTilesLayoutConfig.layout
  )

  if (contentTilesLayout === ContentTilesLayout.Topbar) {
    return (
      <div className="flex flex-col gap-2 h-full w-full">
        <div
          className="flex-none w-full"
          style={{
            height: `${TOPBAR_PARTICIPANT_TILES_HEIGHT}px`,
          }}>
          <ParticipantTiles spotlightMode={false} />
        </div>
        <div className="flex-auto h-full w-full">{children}</div>
      </div>
    )
  }

  return (
    <PanelGroup direction="horizontal" autoSaveId="contentTilesLayout">
      <Panel minSize={30} maxSize={100} defaultSize={80} collapsedSize={50}>
        {children}
      </Panel>

      <PanelResizer />

      <Panel minSize={15} collapsedSize={15} defaultSize={20} maxSize={50}>
        <div className="flex flex-col overflow-auto h-full flex-1">
          <ParticipantTiles spotlightMode={false} />
        </div>
      </Panel>
    </PanelGroup>
  )
}
