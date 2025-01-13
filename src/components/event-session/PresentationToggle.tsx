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
import { getFirstFrame } from '@/utils/event.util'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

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

  const handlePresentationToggle = () => {
    if (presentationStatus === PresentationStatuses.STOPPED) {
      const frameSelected = !overviewOpen && !currentSectionId && currentFrame

      const frameToStart = frameSelected
        ? currentFrame.id
        : (getFirstFrame(sections)?.id as string)

      startPresentation(frameToStart)
      dispatch(setIsOverviewOpenAction(false))
      dispatch(setCurrentSectionIdAction(null))
      dispatch(setCurrentFrameIdAction(frameToStart))

      return
    }

    stopPresentation()
  }

  useHotkeys(
    's',
    handlePresentationToggle,
    [presentationStatus],
    liveHotKeyProps
  )

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
