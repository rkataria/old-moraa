import EventSessionContext from "@/contexts/EventSessionContext"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import React, { useContext, useState } from "react"
import ControlButton from "./ControlButton"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

export function PresentationControls() {
  const { meeting } = useDyteMeeting()
  const { presentationStatus, startPresentation, stopPresentation, isHost } =
    useContext(EventSessionContext) as EventSessionContextType

  const handlePreviousSlide = () => {
    meeting?.participants.broadcastMessage("previous-slide", {})
  }

  const handleNextSlide = () => {
    meeting?.participants.broadcastMessage("next-slide", {})
  }

  if (!isHost) return null

  return (
    <>
      {presentationStatus === PresentationStatuses.STOPPED && (
        <ControlButton
          onClick={startPresentation}
          className="!bg-green-500 !text-white"
        >
          Start presentation
        </ControlButton>
      )}

      {presentationStatus === PresentationStatuses.PAUSED && (
        <ControlButton
          onClick={startPresentation}
          className="!bg-white !text-black"
        >
          Resume presentation
        </ControlButton>
      )}
      {presentationStatus !== PresentationStatuses.STOPPED && (
        <>
          <ControlButton onClick={handlePreviousSlide}>
            <IconArrowLeft size={16} />
          </ControlButton>
          <ControlButton onClick={handleNextSlide}>
            <IconArrowRight size={16} />
          </ControlButton>
          <ControlButton
            onClick={stopPresentation}
            className="!bg-red-500 !text-white"
          >
            Stop presentation
          </ControlButton>
        </>
      )}
    </>
  )
}

export default PresentationControls
