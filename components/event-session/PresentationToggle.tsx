import { useContext } from 'react'

import { IoSquare, IoPlay } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function PresentationToggle() {
  const { presentationStatus, startPresentation, stopPresentation } =
    useContext(EventSessionContext) as EventSessionContextType

  const presentationStarted =
    presentationStatus !== PresentationStatuses.STOPPED

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'full',
        variant: 'flat',
        className: cn('transition-all duration-300', {
          'bg-green-500 text-white': !presentationStarted,
          'bg-red-500 text-white': presentationStarted,
        }),
      }}
      tooltipProps={{
        content: presentationStarted ? 'Stop presenting' : 'Start presenting',
      }}
      onClick={() => {
        if (presentationStatus === PresentationStatuses.STOPPED) {
          startPresentation()

          return
        }

        stopPresentation()
      }}>
      {presentationStarted ? <IoSquare size={16} /> : <IoPlay size={16} />}
    </ControlButton>
  )
}
