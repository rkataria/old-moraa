import { Divider } from '@nextui-org/react'

import { NoteToggle } from './NoteToggle'
import { AppsToggle } from '../AppsToggle'
import { ChatsToggle } from '../ChatsToggle'
import { MicToggle } from '../MicToggle'
import { ParticipantsToggle } from '../ParticipantsToggle'
import { RaiseHandToggle } from '../RaiseHandToggle'
import { ReactWithEmojiToggle } from '../ReactWithEmojiToggle'
import { ScreenShareToggle } from '../ScreenShareToggle'
import { VideoToggle } from '../VideoToggle'

import { LiveAgendaPanelToggle } from '@/components/common/AgendaPanel/AgendaPanelToggle'
import { FrameName } from '@/components/common/FrameName'
import { PresentationControls } from '@/components/common/PresentationControls'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { ContentTilesLayout } from '@/stores/slices/layout/live.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function Footer() {
  const layout = useStoreSelector(
    (state) => state.layout.live.contentTilesLayoutConfig.layout
  )
  const currentFrameStates = useStoreSelector(
    (store) => store.layout.studio.currentFrameStates
  )

  return (
    <div
      className={cn('h-full w-full flex justify-between items-center px-2', {
        'bg-white':
          layout === ContentTilesLayout.Spotlight ||
          currentFrameStates?.isFullscreen,
      })}>
      <FooterLeftContent />
      <FooterCenterContent />
      <FooterRightContent />
    </div>
  )
}

function FooterLeftContent() {
  const { permissions } = useEventPermissions()
  const { presentationStatus } = useEventSession()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )

  const isHost = permissions.canAcessAllSessionControls

  return (
    <div className="flex-1 flex justify-start items-center gap-2 p-2">
      <RenderIf isTrue={isHost && !isInBreakoutMeeting}>
        <div className="flex justify-center items-center gap-2 p-2 h-11 rounded-[12px] border-1 border-gray-300 bg-white">
          <LiveAgendaPanelToggle />
        </div>
      </RenderIf>
      <div className="flex justify-start items-center gap-2 p-2 h-11 rounded-[12px] border-1 border-gray-300 bg-white w-56">
        <PresentationControls />
        <Divider orientation="vertical" />
        <FrameName
          animate={presentationStatus === PresentationStatuses.STARTED}
        />
        {/* <FrameDuration /> */}
        {/* <SessionPlannerToggle /> */}
      </div>
    </div>
  )
}

function FooterCenterContent() {
  const { permissions } = useEventPermissions()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const isHost = permissions.canAcessAllSessionControls

  return (
    <div className="flex-auto flex justify-center items-center gap-2">
      <div className="flex justify-center items-center gap-2 p-2 h-11 rounded-[12px] border-1 border-gray-300 bg-white">
        <MicToggle />
        <VideoToggle />
        <ScreenShareToggle />
        <Divider orientation="vertical" />
        {/* <MoreActions /> */}
        {/* <PresentationControls /> */}
        <RaiseHandToggle />
        <ReactWithEmojiToggle />
        <Divider orientation="vertical" />
        <ParticipantsToggle />
        <ChatsToggle />
        <NoteToggle />
      </div>
      <RenderIf isTrue={isHost && !isInBreakoutMeeting}>
        <div className="flex justify-center items-center gap-2 p-2 h-11 rounded-[12px] border-1 border-gray-300 bg-white">
          <AppsToggle />
        </div>
      </RenderIf>
    </div>
  )
}

function FooterRightContent() {
  return <div className="flex-1 flex justify-end items-center gap-2 p-2" />
}
