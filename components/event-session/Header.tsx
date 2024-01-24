"use client"

import React, { useContext } from "react"
import { useParams } from "next/navigation"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import {
  DyteBreakoutRoomsToggle,
  DyteCameraToggle,
  DyteChatToggle,
  DyteClock,
  DyteLeaveButton,
  DyteMicToggle,
  DyteMoreToggle,
  DyteParticipantsToggle,
  DytePluginsToggle,
  DytePollsToggle,
  DyteScreenShareToggle,
} from "@dytesdk/react-ui-kit"

import { useEvent } from "@/hooks/useEvent"
import PresentationControls from "./PresentationControls"
import ControlButton from "./ControlButton"
import EventSessionContext from "@/contexts/EventSessionContext"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import { IconMenu } from "@tabler/icons-react"

type HeaderProps = {
  states: any
  setState: any
  toggleSlidesSidebarVisiblity: () => void
}

function Header({
  states,
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
        <DyteMicToggle meeting={meeting} size="sm" />
        <DyteCameraToggle meeting={meeting} size="sm" />
        <DyteScreenShareToggle meeting={meeting} size="sm" />
        {isHost && <DyteBreakoutRoomsToggle meeting={meeting} size="sm" />}
        <PresentationControls />
        
        <DyteMoreToggle size="sm" />
        <DyteLeaveButton size="sm"  onClick={() => {
            setState({
              activeLeaveConfirmation: true,
            })
          }}/>
        </div>
        <div className="p-4 flex justify-start items-center gap-6">
        <DyteParticipantsToggle meeting={meeting} size="sm" />
        <DyteChatToggle meeting={meeting} size="sm" />
        <DytePollsToggle meeting={meeting} size="sm" />
        {isHost && <DytePluginsToggle meeting={meeting} size="sm" />}
      </div>
    </div>
  )
}

export default Header
