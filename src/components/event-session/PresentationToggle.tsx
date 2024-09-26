import { useHotkeys } from 'react-hotkeys-hook'
import { IoPlay, IoStop } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'
import { cn, KeyboardShortcuts } from '@/utils/utils'

export function PresentationToggle() {
  const { sections } = useEventContext()
  const {
    currentFrame,
    presentationStatus,
    startPresentation,
    stopPresentation,
  } = useEventSession()

  const presentationStarted =
    presentationStatus && presentationStatus !== PresentationStatuses.STOPPED

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePresentationToggle = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return

    if (presentationStatus === PresentationStatuses.STOPPED) {
      startPresentation(
        currentFrame ? currentFrame.id : sections[0].frames[0].id
      )

      return
    }

    stopPresentation()
  }

  useHotkeys('s', handlePresentationToggle, [presentationStatus])

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        size: 'sm',
        className: cn('text-white', {
          'bg-green-500': !presentationStarted,
          'bg-red-500': presentationStarted,
        }),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.startAndStopPresentation.label,
        actionKey: KeyboardShortcuts.Live.startAndStopPresentation.key,
      }}
      onClick={handlePresentationToggle}>
      {presentationStarted ? <IoStop size={18} /> : <IoPlay size={18} />}
    </ControlButton>
  )
}
