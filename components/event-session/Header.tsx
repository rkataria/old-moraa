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
import { useParams } from 'next/navigation'
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go'

import { Button } from '@nextui-org/react'

import { FlyingEmojis } from './FlyingEmojis'
import { GalleryViewToggle } from './GalleryViewToggle'
import { PresentationControls } from './PresentationControls'
import { RaiseHand } from './RaiseHand'
import { WhiteboardToggleButton } from './WhiteboardToggleButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { EventSessionContextType } from '@/types/event-session.type'

type HeaderProps = {
  leftSidebarVisible: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateDyteStates: any
  toggleLeftSidebar?: () => void
}

export function Header({
  leftSidebarVisible,
  onUpdateDyteStates,
  toggleLeftSidebar = () => {},
}: HeaderProps) {
  const { eventId } = useParams()
  const { event } = useEvent({ id: eventId as string })
  const { meeting } = useDyteMeeting()
  const { isHost, eventSessionMode } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (!event) return null

  return (
    <div className="h-16 bg-gray-950 flex justify-between items-center">
      <div className="p-4 flex justify-end items-center gap-2">
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
      <div className="p-4 flex justify-end items-center gap-2">
        {eventSessionMode === 'Preview' && isHost && <GalleryViewToggle />}
        <DyteMicToggle meeting={meeting} size="lg" />
        <DyteCameraToggle meeting={meeting} size="lg" />
        {isHost && <DyteScreenShareToggle meeting={meeting} size="lg" />}

        <PresentationControls />
        <RaiseHand />
        <FlyingEmojis />
        <DyteSettingsToggle
          size="lg"
          onClick={() => {
            onUpdateDyteStates({
              activeSettings: true,
            })
          }}
        />
        <DyteLeaveButton
          size="lg"
          onClick={() => {
            onUpdateDyteStates({
              activeLeaveConfirmation: true,
            })
          }}
        />
      </div>

      <div className="p-4 flex justify-start items-center gap-2">
        <DyteParticipantsToggle
          meeting={meeting}
          size="lg"
          onClick={() => {
            onUpdateDyteStates({
              activeSidebar: true,
              sidebar: 'participants',
            })
          }}
        />
        <DyteChatToggle
          meeting={meeting}
          size="lg"
          onClick={() => {
            onUpdateDyteStates({
              activeSidebar: true,
              sidebar: 'chat',
            })
          }}
        />
        {isHost && (
          <DytePluginsToggle
            meeting={meeting}
            size="lg"
            onClick={() => {
              onUpdateDyteStates({
                activeSidebar: true,
                sidebar: 'plugins',
              })
            }}
          />
        )}
        {isHost && <WhiteboardToggleButton />}
      </div>
    </div>
  )
}
