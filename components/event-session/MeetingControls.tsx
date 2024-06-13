/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'

import { DyteBreakoutRoomsToggle, DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from 'next/navigation'

import { Tooltip } from '@nextui-org/react'

import { AiToggle } from './AiToggle'
import { ChatsToggle } from './ChatsToggle'
import { LeaveMeetingToggle } from './LeaveMeetingToggle'
import { LobbyViewToggle } from './LobbyViewToggle'
import { MediaSettingsToggle } from './MediaSettingsToggle'
import { type RightSiderbar } from './MeetingScreen'
import { MicToggle } from './MicToggle'
import { NotesToggle } from './NotesToggle'
import { ParticipantsToggle } from './ParticipantsToggle'
import { PresentationToggle } from './PresentationToggle'
import { RaiseHandToggle } from './RaiseHandToggle'
import { ReactWithEmojiToggle } from './ReactWithEmojiToggle'
import { ScreenShareToggle } from './ScreenShareToggle'
import { Timer } from './Timer'
import { VideoToggle } from './VideoToggle'
import { WhiteBoardToggle } from './WhiteBoardToggle'
import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { EventSessionContextType } from '@/types/event-session.type'

type MeetingControlsProps = {
  rightSidebar: RightSiderbar | null
  onDyteStateUpdate: (data: { [key: string]: string | boolean }) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSidebarOpen: (data: {
    activeSidebar: boolean
    sidebar: RightSiderbar
  }) => void
  onAiChatOverlayToggle: () => void
  dyteStates: any
  setDyteStates: any
  onNoteOverlayToggle: () => void
}

export function MeetingControls({
  rightSidebar,
  onDyteStateUpdate,
  onSidebarOpen,
  onAiChatOverlayToggle,
  dyteStates,
  setDyteStates,
  onNoteOverlayToggle,
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
        <Tooltip content={event.name} closeDelay={100}>
          <span className="pr-2 w-[175px] overflow-hidden !whitespace-nowrap text-ellipsis">
            {event.name}
          </span>
        </Tooltip>
        {isHost && <PresentationToggle />}
      </div>
      <div className="flex justify-end items-center gap-3">
        {eventSessionMode === 'Preview' && isHost && <LobbyViewToggle />}
        <MicToggle />
        <VideoToggle />
        {isHost && <ScreenShareToggle />}
        <RaiseHandToggle />
        <ReactWithEmojiToggle />
        <MediaSettingsToggle
          onClick={() =>
            onDyteStateUpdate({
              activeSettings: true,
            })
          }
        />
        <WhiteBoardToggle />
        <Timer />
      </div>

      <div className="flex justify-end items-center gap-3">
        <AiToggle
          isAiSidebarOpen={rightSidebar === 'ai-chat'}
          onClick={onAiChatOverlayToggle}
        />
        <ParticipantsToggle
          isParticipantsSidebarOpen={rightSidebar === 'participants'}
          onClick={() => {
            onSidebarOpen({
              activeSidebar: true,
              sidebar: 'participants',
            })
          }}
        />
        {isHost && (
          <NotesToggle
            isNotesSidebarOpen={rightSidebar === 'notes'}
            onClick={onNoteOverlayToggle}
          />
        )}
        <ChatsToggle
          isChatsSidebarOpen={rightSidebar === 'chat'}
          onClick={() => {
            onSidebarOpen({
              activeSidebar: true,
              sidebar: 'chat',
            })
          }}
        />
        <DyteBreakoutRoomsToggle
          meeting={meeting}
          states={dyteStates}
          onDyteStateUpdate={(e) =>
            setDyteStates({ ...e.detail, mode: 'view' })
          }
        />

        <ControlButton
          buttonProps={{
            variant: 'flat',
            radius: 'full',
            className: 'px-1',
          }}
          tooltipProps={{
            content: 'Meeting time',
          }}
          onClick={() => {}}>
          <DyteClock meeting={meeting} />
        </ControlButton>
        <LeaveMeetingToggle />
      </div>
    </div>
  )
}
