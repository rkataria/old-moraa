/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect } from 'react'

import {
  DyteDialogManager,
  DyteNotifications,
  DyteParticipantsAudio,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

import { FlyingEmojisOverlay } from './FlyingEmojisOverlay'
import { IdleModeConfirmation } from './IdleModeConfirmation'
import { MainContainer } from './MainContainer'
import { MeetingHeader } from './MeetingHeader'
import { MeetingRightSidebar } from './MeetingRightSidebar'
import { RightSidebarControls } from './RightSidebarControls'
import { AgendaPanel } from '../common/AgendaPanel'
import { BreakoutRoomsWithParticipants } from '../common/breakout/BreakoutRoomsFrame'
import { CreateUnplannedBreakoutModal } from '../common/breakout/CreateBreakoutModal'
import { StudioLayout } from '../common/StudioLayout/Index'
import { ResizableRightSidebar } from '../event-content/ResizableRightSidebar'

import { EventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  setIsCreateBreakoutOpenAction,
  updateEventSessionModeAction,
} from '@/stores/slices/event/current-event/live-session.slice'
import { EventContextType } from '@/types/event-context.type'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'

export type RightSiderbar =
  | 'participants'
  | 'chat'
  | 'plugins'
  | 'ai-chat'
  | 'notes'
  | 'breakout'

export type DyteStates = {
  [key: string]: string | boolean
}

export function MeetingScreen() {
  const { meeting } = useDyteMeeting()
  const { preview } = useContext(EventContext) as EventContextType
  const dispatch = useStoreDispatch()
  const isCreateBreakoutOpen = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isCreateBreakoutOpen
  )
  const {
    isHost,
    presentationStatus,
    dyteStates,
    setDyteStates,
    currentFrame,
  } = useEventSession()
  const { isBreakoutActive } = useBreakoutRooms()
  const activePlugin = useDyteSelector((m) => m.plugins.active.toArray()?.[0])
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )
  const breakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.breakoutFrameId
  )

  const isScreensharing = !!screensharingParticipant || selfScreenShared

  useEffect(() => {
    if (
      activePlugin ||
      isScreensharing ||
      presentationStatus === PresentationStatuses.STARTED
    ) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PRESENTATION))

      return
    }

    dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreensharing, activePlugin, presentationStatus, preview, isHost])

  // NOTE: Commented out as this is not needed and causes an glitch when participant leaves
  // useEffect(() => {
  //   if (!meeting) return

  //   const handleParticipantLeft = (participant: DyteParticipant) => {
  //     updateTypingUsers({
  //       isTyping: false,
  //       participantId: participant.id,
  //     })

  //     if (isHost && eventSessionMode === EventSessionMode.PRESENTATION) {
  //       dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
  //       updateActiveSession({
  //         presentationStatus: PresentationStatuses.STOPPED,
  //       })
  //     }
  //   }

  //   meeting.participants.joined.on('participantLeft', handleParticipantLeft)

  //   function onUnmount() {
  //     meeting.participants.joined.off('participantLeft', handleParticipantLeft)
  //   }

  //   // eslint-disable-next-line consistent-return
  //   return onUnmount
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [meeting, eventSessionMode])

  const BottomContentElement =
    isHost && isBreakoutActive && breakoutFrameId === currentFrame?.id ? (
      <BreakoutRoomsWithParticipants hideActivityCards />
    ) : null

  return (
    <StudioLayout
      header={
        <MeetingHeader dyteStates={dyteStates} setDyteStates={setDyteStates} />
      }
      leftSidebar={isHost ? <AgendaPanel /> : null}
      resizableRightSidebar={<ResizableRightSidebar />}
      rightSidebar={
        <MeetingRightSidebar
          dyteStates={dyteStates}
          setDyteStates={setDyteStates}
        />
      }
      rightSidebarControls={<RightSidebarControls />}
      bottomContent={BottomContentElement}>
      <MainContainer />

      {/* Emoji Overlay */}
      <FlyingEmojisOverlay />

      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications meeting={meeting} />
      <DyteDialogManager
        meeting={meeting}
        states={dyteStates}
        onDyteStateUpdate={(e) => {
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            ...e.detail,
          }))
        }}
      />
      <CreateUnplannedBreakoutModal
        open={isCreateBreakoutOpen}
        setOpen={() => dispatch(setIsCreateBreakoutOpenAction(false))}
      />
      <IdleModeConfirmation />
    </StudioLayout>
  )
}
