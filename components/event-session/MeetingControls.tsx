/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'

import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from 'next/navigation'

import { Tooltip } from '@nextui-org/react'

import { AiToggle } from './AiToggle'
import { BreakoutSlideToggle } from './BreakoutToggle'
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

import { useBreakoutRooms } from '@/contexts/BreakoutRoomsManagerContext'
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
  onNoteOverlayToggle: () => void
}

export function MeetingControls({
  rightSidebar,
  onDyteStateUpdate,
  onSidebarOpen,
  onAiChatOverlayToggle,
  onNoteOverlayToggle,
}: MeetingControlsProps) {
  const { eventId } = useParams()
  const { event } = useEvent({ id: eventId as string })
  const { meeting } = useDyteMeeting()
  const { isHost, eventSessionMode, isBreakoutSlide, setIsBreakoutSlide } =
    useContext(EventSessionContext) as EventSessionContextType
  const { isCurrentDyteMeetingInABreakoutRoom } = useBreakoutRooms()

  return (
    <div className="h-16 bg-transparent flex justify-between items-center">
      <div className="flex justify-end items-center gap-6">
        <Tooltip content={event.name} closeDelay={100}>
          <span className="max-w-[10.9375rem] overflow-hidden !whitespace-nowrap text-ellipsis">
            {event.name}
          </span>
        </Tooltip>

        <ControlButton
          buttonProps={{
            variant: 'light',
            size: 'sm',
            className: 'hover:bg-transparent p-0',
          }}
          tooltipProps={{
            content: 'Meeting time',
          }}
          onClick={() => {}}>
          <DyteClock meeting={meeting} className="m-0" />
        </ControlButton>

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
        {!isCurrentDyteMeetingInABreakoutRoom && isHost ? (
          <BreakoutSlideToggle
            isActive={isBreakoutSlide}
            onClick={() => setIsBreakoutSlide(!isBreakoutSlide)}
          />
        ) : null}
        {/* {isBreakoutActive ? (
          isHost ? (
            <BreakoutSlideToggle
              isActive={isBreakoutSlide}
              onClick={() => setIsBreakoutSlide(!isBreakoutSlide)}
            />
          ) : null
        ) : (
          <DyteBreakoutRoomsToggle
            meeting={meeting}
            states={dyteStates}
            onDyteStateUpdate={(e) => setDyteStates({ ...e.detail })}
            className="bg-transparent h-2 w-4 mr-8"
            iconPack={{
              ...defaultIconPack,
              breakout_rooms:
                '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72z"></path><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M336 304c-65.17 0-127.84 32.37-143.54 95.41-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94z"></path><path fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M206 306c-18.05-8.27-37.93-11.45-59-11.45-52 0-102.1 25.85-114.65 76.2-1.65 6.66 2.53 13.25 9.37 13.25H154"></path></svg>',
            }}
            size="sm"
          />
        )} */}
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
        <LeaveMeetingToggle />
      </div>
    </div>
  )
}
