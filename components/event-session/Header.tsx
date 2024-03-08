'use client'

import React, { useContext } from 'react'

import {
  DyteCameraToggle,
  DyteChatToggle,
  DyteClock,
  DyteLeaveButton,
  DyteMicToggle,
  DyteParticipantsToggle,
  DytePluginsToggle,
  DyteScreenShareToggle,
  DyteSettingsToggle,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { IconMenu } from '@tabler/icons-react'
import { useParams } from 'next/navigation'

import { ControlButton } from './ControlButton'
import { PresentationControls } from './PresentationControls'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'

type HeaderProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: any
  toggleSlidesSidebarVisiblity: () => void
}

export function Header({
  setState,
  toggleSlidesSidebarVisiblity,
}: HeaderProps) {
  const { eventId } = useParams()
  const { event } = useEvent({ id: eventId as string })
  const { meeting } = useDyteMeeting()
  const { presentationStatus, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (!event) return null

  return (
    <div className="h-16 bg-gray-950 flex justify-between items-center">
      <div className="p-4 flex justify-end items-center gap-2">
        {presentationStatus !== PresentationStatuses.STOPPED && (
          <ControlButton onClick={toggleSlidesSidebarVisiblity}>
            <IconMenu size={16} />
          </ControlButton>
        )}
        <DyteClock meeting={meeting} />
      </div>
      <div className="p-4 flex justify-end items-center gap-2">
        <DyteMicToggle meeting={meeting} size="lg" />
        <DyteCameraToggle meeting={meeting} size="lg" />
        {isHost && <DyteScreenShareToggle meeting={meeting} size="lg" />}

        <PresentationControls />
        <DyteSettingsToggle
          size="sm"
          onClick={() => {
            setState({
              activeSettings: true,
            })
          }}
        />
        <DyteLeaveButton
          size="lg"
          onClick={() => {
            setState({
              activeLeaveConfirmation: true,
            })
          }}
        />
      </div>
      <div className="p-4 flex justify-start items-center gap-2">
        <DyteParticipantsToggle meeting={meeting} size="lg" />
        <DyteChatToggle meeting={meeting} size="lg" />
        {isHost && <DytePluginsToggle meeting={meeting} size="lg" />}
      </div>
    </div>
  )
}
