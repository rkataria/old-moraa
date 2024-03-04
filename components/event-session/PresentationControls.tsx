import React, { useContext } from 'react'

import { ControlButton } from './ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'

export function PresentationControls() {
  const { presentationStatus, startPresentation, stopPresentation, isHost } =
    useContext(EventSessionContext) as EventSessionContextType

  if (!isHost) return null

  return (
    <>
      {presentationStatus === PresentationStatuses.STOPPED && (
        <ControlButton
          onClick={startPresentation}
          className="!bg-green-500 !text-white">
          Present
        </ControlButton>
      )}

      {presentationStatus === PresentationStatuses.PAUSED && (
        <ControlButton
          onClick={startPresentation}
          className="!bg-white !text-black">
          Resume
        </ControlButton>
      )}
      {presentationStatus !== PresentationStatuses.STOPPED && (
        <ControlButton
          onClick={stopPresentation}
          className="!bg-red-500 !text-white">
          Stop
        </ControlButton>
      )}
    </>
  )
}
