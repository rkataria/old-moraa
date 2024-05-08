import React, { useContext } from 'react'

import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from 'next/navigation'

import { AiToggle } from './AiToggle'
import { AppsToggle } from './AppsToggle'
import { ChatsToggle } from './ChatsToggle'
import { LeaveMeetingToggle } from './LeaveMeetingToggle'
import { LobbyViewToggle } from './LobbyViewToggle'
import { MediaSettingsToggle } from './MediaSettingsToggle'
import { type RightSiderbar } from './MeetingScreen'
import { MicToggle } from './MicToggle'
import { ParticipantsToggle } from './ParticipantsToggle'
import { PresentationToggle } from './PresentationToggle'
import { RaiseHandToggle } from './RaiseHandToggle'
import { ReactWithEmojiToggle } from './ReactWithEmojiToggle'
import { ScreenShareToggle } from './ScreenShareToggle'
import { VideoToggle } from './VideoToggle'
import { WhiteBoardToggle } from './WhiteBoardToggle'

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
}

export function MeetingControls({
  rightSidebar,
  onDyteStateUpdate,
  onSidebarOpen,
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
      <div className="flex justify-end items-center gap-3">
        {eventSessionMode === 'Preview' && isHost && <LobbyViewToggle />}
        {/* <DyteMicToggle meeting={meeting} size="sm" /> */}
        <MicToggle />
        <VideoToggle />
        {isHost && <ScreenShareToggle />}
        {isHost && <PresentationToggle />}
        <RaiseHandToggle />
        <ReactWithEmojiToggle />
        <AppsToggle />
        <MediaSettingsToggle
          onClick={() =>
            onDyteStateUpdate({
              activeSettings: true,
            })
          }
        />
        <LeaveMeetingToggle />
      </div>

      <div className="flex justify-start items-center gap-3">
        <AiToggle
          isAiSidebarOpen={rightSidebar === 'aichat'}
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
        <ChatsToggle
          isChatsSidebarOpen={rightSidebar === 'chat'}
          onClick={() => {
            onSidebarOpen({
              activeSidebar: true,
              sidebar: 'chat',
            })
          }}
        />
        {isHost && <WhiteBoardToggle />}
      </div>
    </div>
  )
}
