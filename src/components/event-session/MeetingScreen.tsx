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
import { DyteParticipant } from '@dytesdk/web-core'

import { FlyingEmojisOverlay } from './FlyingEmojisOverlay'
import { MainContainer } from './MainContainer'
import { MeetingHeader } from './MeetingHeader'
import { MeetingRightSidebar } from './MeetingRightSidebar'
import { RightSidebarControls } from './RightSidebarControls'
import { AgendaPanel } from '../common/AgendaPanel'
import { BreakoutRoomsWithParticipants } from '../common/breakout/BreakoutRoomsFrame'
import { CreateBreakoutModal } from '../common/breakout/CreateBreakoutModal'
import { BREAKOUT_TYPES } from '../common/BreakoutTypePicker'
import { StudioLayout } from '../common/StudioLayout/Index'
import { ResizableRightSidebar } from '../event-content/ResizableRightSidebar'

import { EventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useParticipantBreakoutFrameSetter } from '@/hooks/useParticipantBreakoutFrameSetter'
import { EventContextType } from '@/types/event-context.type'
import { PresentationStatuses } from '@/types/event-session.type'

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

  const {
    isHost,
    eventSessionMode,
    presentationStatus,
    dyteStates,
    setDyteStates,
    setEventSessionMode,
    updateActiveSession,
    updateTypingUsers,
    isCreateBreakoutOpen,
    setIsCreateBreakoutOpen,
    breakoutSlideId,
    currentFrame,
  } = useEventSession()
  const { isBreakoutActive } = useBreakoutRooms()
  useParticipantBreakoutFrameSetter()

  const activePlugin = useDyteSelector((m) => m.plugins.active.toArray()?.[0])
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  const isScreensharing = !!screensharingParticipant || selfScreenShared

  useEffect(() => {
    if (
      activePlugin ||
      isScreensharing ||
      presentationStatus === PresentationStatuses.STARTED
    ) {
      setEventSessionMode('Presentation')

      return
    }

    setEventSessionMode('Lobby')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreensharing, activePlugin, presentationStatus, preview, isHost])

  useEffect(() => {
    if (!meeting) return

    const handleParticipantLeft = (participant: DyteParticipant) => {
      updateTypingUsers({
        isTyping: false,
        participantId: participant.id,
      })

      if (
        participant.presetName?.includes('host') &&
        eventSessionMode === 'Presentation'
      ) {
        setEventSessionMode('Lobby')
        updateActiveSession({
          presentationStatus: PresentationStatuses.STOPPED,
        })
      }
    }

    meeting.participants.joined.on('participantLeft', handleParticipantLeft)

    function onUnmount() {
      meeting.participants.joined.off('participantLeft', handleParticipantLeft)
    }

    // eslint-disable-next-line consistent-return
    return onUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting, eventSessionMode])

  const BottomContentElement =
    isHost &&
    isBreakoutActive &&
    breakoutSlideId === currentFrame?.id &&
    currentFrame.config?.breakoutType !== BREAKOUT_TYPES.ROOMS ? (
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
      <CreateBreakoutModal
        open={isCreateBreakoutOpen}
        setOpen={() => setIsCreateBreakoutOpen(false)}
      />
    </StudioLayout>
  )
}
