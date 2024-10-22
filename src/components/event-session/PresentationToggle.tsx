import { useHotkeys } from 'react-hotkeys-hook'
import { IoPlay } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'
import { PresentationControls } from '../common/PresentationControls'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import {
  setCurrentFrameIdAction,
  setCurrentSectionIdAction,
  setIsOverviewOpenAction,
} from '@/stores/slices/event/current-event/event.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { cn, KeyboardShortcuts } from '@/utils/utils'

export function PresentationToggle() {
  const dispatch = useStoreDispatch()
  const { sections, overviewOpen, currentSectionId } = useEventContext()
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
      const frameSelected = !overviewOpen && !currentSectionId && currentFrame

      const frameToStart = frameSelected
        ? currentFrame.id
        : sections[0].frames[0].id

      startPresentation(frameToStart)
      dispatch(setIsOverviewOpenAction(false))
      dispatch(setCurrentSectionIdAction(null))
      dispatch(setCurrentFrameIdAction(frameToStart))

      return
    }

    stopPresentation()
  }

  useHotkeys('s', handlePresentationToggle, [presentationStatus])

  if (presentationStarted) {
    return <PresentationControls />
  }

  return (
    <ControlButton
      buttonProps={{
        size: 'sm',
        className: cn('text-white bg-green-500'),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.startAndStopPresentation.label,
        actionKey: KeyboardShortcuts.Live.startAndStopPresentation.key,
      }}
      onClick={handlePresentationToggle}>
      <IoPlay size={18} />
      <span className="text-white">Start</span>
    </ControlButton>
  )
}
