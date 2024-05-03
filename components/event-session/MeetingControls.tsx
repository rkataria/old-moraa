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
import { Sparkles } from 'lucide-react'
import { useParams } from 'next/navigation'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateDyteStates: any
  onAiChatOverlayToggle: () => void
}

export function MeetingControls({
  onUpdateDyteStates,
  onAiChatOverlayToggle,
}: MeetingControlsProps) {
  const { eventId } = useParams()
  const { event } = useEvent({ id: eventId as string })
  const { meeting } = useDyteMeeting()
  const { isHost, eventSessionMode } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (!event) return null

  return (
    <div className="h-16 bg-transparent flex justify-between items-center">
      <div className="flex justify-end items-center gap-2">
        {/* <Link href="/events">
          <Button isIconOnly variant="light">
            <MdArrowBack size={18} />
          </Button>
        </Link> */}
        <div
          className="flex flex-col justify-center items-center px-2 h-10 rounded-sm"
          style={{
            backgroundColor:
              'var(--dyte-controlbar-button-background-color, rgb(var(--dyte-colors-background-1000, 8 8 8))',
          }}>
          <DyteClock meeting={meeting} />
        </div>
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
        <Button
          isIconOnly
          onClick={onAiChatOverlayToggle}
          className="flex justify-center items-center transition-all duration-200 cursor-pointer font-normal text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 !rounded-full p-3">
          <Sparkles />
        </Button>
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
