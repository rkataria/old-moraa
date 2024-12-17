import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { RiPlayCircleFill, RiStopCircleFill } from 'react-icons/ri'

import { FrameSmartControls } from '../event-session/FrameSmartControlsPopover/FrameSmartControlsPopover'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'
import { cn, KeyboardShortcuts } from '@/utils/utils'

export function PresentationControls() {
  const {
    isHost,
    previousFrame,
    currentFrame,
    nextFrame,
    startPresentation,
    stopPresentation,
    presentationStatus,
    eventSessionMode,
  } = useEventSession()
  const dispatch = useStoreDispatch()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePresentationToggle = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
    if (presentationStarted) {
      stopPresentation()
    } else {
      startPresentation(currentFrame?.id || null)
    }
  }

  useHotkeys(
    KeyboardShortcuts.Live.startAndStopPresentation.key,
    handlePresentationToggle,
    { enabled: isHost }
  )

  const handlePreviousButton = () => {
    if (eventSessionMode === EventSessionMode.LOBBY) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PEEK))
    }

    previousFrame()
  }

  const handleNextButton = () => {
    if (eventSessionMode === EventSessionMode.LOBBY) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PEEK))
    }

    nextFrame()
  }

  // Allow only host to control the presentation
  if (!isHost) return null

  const presentationStarted =
    presentationStatus === PresentationStatuses.STARTED

  return (
    <div className="relative flex justify-end items-center -mx-2">
      <Button
        isIconOnly
        size="sm"
        className="live-button"
        variant="light"
        disableRipple
        disableAnimation
        onClick={handlePreviousButton}>
        <IoIosArrowBack size={18} />
      </Button>
      <Button
        isIconOnly
        size="md"
        disableRipple
        disableAnimation
        className={cn('rounded-md bg-transparent hover:bg-transparent')}
        variant="light"
        onClick={handlePresentationToggle}>
        {presentationStarted ? (
          <RiStopCircleFill size={32} className="text-red-500" />
        ) : (
          <RiPlayCircleFill size={32} className="text-foreground" />
        )}
      </Button>
      <FrameSmartControls />
      <Button
        isIconOnly
        size="sm"
        className="live-button"
        variant="light"
        disableRipple
        disableAnimation
        onClick={handleNextButton}>
        <IoIosArrowForward size={18} />
      </Button>
    </div>
  )
}
