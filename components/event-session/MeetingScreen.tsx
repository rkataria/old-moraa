/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useContext, useEffect, useState } from 'react'

import {
  DyteDialogManager,
  DyteNotifications,
  DyteParticipantsAudio,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant } from '@dytesdk/web-core'

import { MainContainer } from './MainContainer'
import { MeetingHeader } from './MeetingHeader'
import { MeetingRightSidebar } from './MeetingRightSidebar'
import { AgendaPanel } from '../common/AgendaPanel'
import { StudioLayout } from '../common/StudioLayout'

import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventContextType } from '@/types/event-context.type'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'

export type DyteStates = {
  [key: string]: string | boolean
}

export type RightSiderbar = 'participants' | 'chat' | 'plugins' | 'ai-chat'

export function MeetingScreen() {
  const { meeting } = useDyteMeeting()
  const [dyteStates, setDyteStates] = useState<DyteStates>({})
  const { preview } = useContext(EventContext) as EventContextType
  const {
    isHost,
    eventSessionMode,
    presentationStatus,
    setEventSessionMode,
    updateActiveSession,
    updateTypingUsers,
  } = useContext(EventSessionContext) as EventSessionContextType

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

    const handleHostLeft = (participant: DyteParticipant) => {
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

    meeting.participants.joined.on('participantLeft', handleHostLeft)

    function onUnmount() {
      meeting.participants.joined.off('participantLeft', handleHostLeft)
    }

    // eslint-disable-next-line consistent-return
    return onUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting, eventSessionMode])

  return (
    <StudioLayout
      header={
        <MeetingHeader dyteStates={dyteStates} setDyteStates={setDyteStates} />
      }
      leftSidebar={<AgendaPanel />}
      rightSidebar={
        <MeetingRightSidebar
          dyteStates={dyteStates}
          setDyteStates={setDyteStates}
        />
      }>
      <MainContainer />
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
    </StudioLayout>
  )
}
