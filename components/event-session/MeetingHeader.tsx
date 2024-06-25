import React, { Dispatch, SetStateAction, useContext } from 'react'

import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'

import { Tooltip } from '@nextui-org/react'

import { BreakoutSlideToggle } from './BreakoutToggle'
import { ChatsToggle } from './ChatsToggle'
import { LeaveMeetingToggle } from './LeaveMeetingToggle'
import { LobbyViewToggle } from './LobbyViewToggle'
import { MediaSettingsToggle } from './MediaSettingsToggle'
import { MicToggle } from './MicToggle'
import { ParticipantsToggle } from './ParticipantsToggle'
import { PresentationToggle } from './PresentationToggle'
import { RaiseHandToggle } from './RaiseHandToggle'
import { ReactWithEmojiToggle } from './ReactWithEmojiToggle'
import { ScreenShareToggle } from './ScreenShareToggle'
import { Timer } from './Timer'
import { VideoToggle } from './VideoToggle'
import { WhiteBoardToggle } from './WhiteBoardToggle'
import { ControlButton } from '../common/ControlButton'
import { AIChatbotToggleButton } from '../common/StudioLayout/AIChatbotToggleButton'

import { useBreakoutRooms } from '@/contexts/BreakoutRoomsManagerContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventSessionContextType } from '@/types/event-session.type'

export type DyteStates = {
  [key: string]: string | boolean
}

type MeetingHeaderProps = {
  dyteStates: DyteStates
  setDyteStates: Dispatch<SetStateAction<DyteStates>>
}

export function MeetingHeader({
  dyteStates,
  setDyteStates,
}: MeetingHeaderProps) {
  const { eventId } = useParams()
  const { event } = useEvent({ id: eventId as string })
  const { meeting } = useDyteMeeting()
  const { isHost, eventSessionMode, isBreakoutSlide, setIsBreakoutSlide } =
    useContext(EventSessionContext) as EventSessionContextType
  const { rightSidebarVisiblity, setRightSidebarVisiblity, toggleLeftSidebar } =
    useStudioLayout()

  const { isCurrentDyteMeetingInABreakoutRoom } = useBreakoutRooms()

  useHotkeys('ctrl + [', toggleLeftSidebar, [])
  useHotkeys('ctrl + ]', () => setRightSidebarVisiblity(null), [])

  if (!event) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSidebarOpen = (data: any) => {
    if (rightSidebarVisiblity === data.sidebar) {
      setRightSidebarVisiblity(null)
      setDyteStates({
        ...dyteStates,
        [data.sidebar]: false,
      })

      return
    }

    if (['participants', 'chat', 'plugins'].includes(data.sidebar)) {
      setDyteStates(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRightSidebarVisiblity(data.sidebar as any)
    }
  }

  return (
    <div className="h-16 px-2 z-[9] bg-transparent flex justify-between items-center">
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
            setDyteStates((prevDyteStates) => ({
              ...prevDyteStates,
              activeSettings: true,
            }))
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
      </div>

      <div className="flex justify-end items-center gap-3">
        {isHost && <AIChatbotToggleButton />}
        <ParticipantsToggle
          isParticipantsSidebarOpen={rightSidebarVisiblity === 'participants'}
          onClick={() => {
            handleSidebarOpen({
              activeSidebar: true,
              sidebar: 'participants',
            })
          }}
        />
        <ChatsToggle
          isChatsSidebarOpen={rightSidebarVisiblity === 'chat'}
          onClick={() => {
            handleSidebarOpen({
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
