import React, { useContext } from 'react'

import {
  DyteCameraToggle,
  DyteChatToggle,
  DyteClock,
  DyteLeaveButton,
  DyteMicToggle,
  DyteParticipantsToggle,
  DyteScreenShareToggle,
  DyteSettingsToggle,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from 'next/navigation'
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go'

import { Button } from '@nextui-org/react'

import { FlyingEmojis } from './FlyingEmojis'
import { LobbyViewToggle } from './LobbyViewToggle'
import { MoreMeetingControls } from './MoreMeetingControls'
import { PresentationControls } from './PresentationControls'
import { RaiseHand } from './RaiseHand'
import { WhiteboardToggleButton } from './WhiteboardToggleButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { EventSessionContextType } from '@/types/event-session.type'

type MeetingControlsProps = {
  leftSidebarVisible: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateDyteStates: any
  toggleLeftSidebar?: () => void
}

export function MeetingControls({
  leftSidebarVisible,
  onUpdateDyteStates,
  toggleLeftSidebar = () => {},
}: MeetingControlsProps) {
  const { eventId } = useParams()
  const { event } = useEvent({ id: eventId as string })
  const { meeting } = useDyteMeeting()
  const { isHost, eventSessionMode } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (!event) return null

  return (
    <div className="h-12 bg-transparent flex justify-between items-center">
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="light"
          isIconOnly
          className="text-white bg-white/5 hover:bg-white/10"
          onClick={toggleLeftSidebar}>
          {leftSidebarVisible ? (
            <GoSidebarCollapse size={24} className="rotate-180" />
          ) : (
            <GoSidebarExpand size={24} className="rotate-180" />
          )}
        </Button>
        <DyteClock meeting={meeting} />
      </div>
      <div className="flex justify-end items-center gap-2">
        {eventSessionMode === 'Preview' && isHost && <LobbyViewToggle />}
        <DyteMicToggle meeting={meeting} size="sm" />
        <DyteCameraToggle meeting={meeting} size="sm" />
        {isHost && <DyteScreenShareToggle meeting={meeting} size="sm" />}

        <PresentationControls />
        <RaiseHand />
        <FlyingEmojis />
        <MoreMeetingControls />
        <DyteSettingsToggle
          iconPack={
            {
              settings:
                '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" height="0.75em" width="0.75em" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
          }
          size="sm"
          onClick={() => {
            onUpdateDyteStates({
              activeSettings: true,
            })
          }}
        />

        <DyteLeaveButton
          size="sm"
          onClick={() => {
            onUpdateDyteStates({
              activeLeaveConfirmation: true,
            })
          }}
        />
      </div>

      <div className="flex justify-start items-center gap-2">
        <DyteParticipantsToggle
          size="sm"
          meeting={meeting}
          onClick={() => {
            onUpdateDyteStates({
              activeSidebar: true,
              sidebar: 'participants',
            })
          }}
        />
        <DyteChatToggle
          size="sm"
          meeting={meeting}
          onClick={() => {
            onUpdateDyteStates({
              activeSidebar: true,
              sidebar: 'chat',
            })
          }}
        />
        {isHost && <WhiteboardToggleButton />}
      </div>
    </div>
  )
}
