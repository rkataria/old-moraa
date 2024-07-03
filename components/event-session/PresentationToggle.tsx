import { useHotkeys } from 'react-hotkeys-hook'
import { FaRegStopCircle } from 'react-icons/fa'
import { IoPlay } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function PresentationToggle() {
  const { presentationStatus, startPresentation, stopPresentation } =
    useEventSession()

  const presentationStarted =
    presentationStatus !== PresentationStatuses.STOPPED

  const handlePresentationToggle = () => {
    if (presentationStatus === PresentationStatuses.STOPPED) {
      startPresentation()

      return
    }

    stopPresentation()
  }

  useHotkeys('s', handlePresentationToggle, [presentationStatus])

  return (
    <ControlButton
      buttonProps={{
        radius: 'md',
        variant: 'flat',
        size: 'sm',
        className: cn('transition-all duration-300', {
          'bg-green-500 text-white': !presentationStarted,
          'bg-red-500 text-white': presentationStarted,
        }),
        startContent: presentationStarted ? (
          <FaRegStopCircle size={16} />
        ) : (
          <IoPlay size={16} />
        ),
      }}
      tooltipProps={{
        content: presentationStarted ? 'Stop presenting' : 'Start presenting',
      }}
      onClick={handlePresentationToggle}>
      {presentationStarted ? 'Stop' : 'Start'}
    </ControlButton>
  )
}
