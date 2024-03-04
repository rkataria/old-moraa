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
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { IconDots, IconMenu } from '@tabler/icons-react'
import { useParams } from 'next/navigation'

import { Button } from '@nextui-org/react'

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
  toggleSettingsModal: () => void
}

export function Header({
  setState,
  toggleSlidesSidebarVisiblity,
  toggleSettingsModal,
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
        <DyteMicToggle meeting={meeting} size="sm" />
        <DyteCameraToggle meeting={meeting} size="sm" />
        {isHost && <DyteScreenShareToggle meeting={meeting} size="sm" />}

        <PresentationControls />
        <Button
          className="p-4 bg-inherit hover:bg-gray-800 bg-opacity-20"
          onClick={toggleSettingsModal}>
          <IconDots className="text-white w-6 h-6" />
        </Button>
        <DyteLeaveButton
          size="sm"
          onClick={() => {
            setState({
              activeLeaveConfirmation: true,
            })
          }}
        />
      </div>
      <div className="p-4 flex justify-start items-center gap-6">
        <DyteParticipantsToggle meeting={meeting} size="sm" />
        <DyteChatToggle meeting={meeting} size="sm" />
        {isHost && <DytePluginsToggle meeting={meeting} size="sm" />}
      </div>
    </div>
  )
}
