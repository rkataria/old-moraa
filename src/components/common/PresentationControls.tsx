import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { RiPlayCircleFill, RiStopCircleFill } from 'react-icons/ri'

import { FrameSmartControlsPopover } from '../event-session/FrameSmartControlsPopover/FrameSmartControlsPopover'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'
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
  } = useEventSession()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePresentationToggle = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
    if (!currentFrame) return
    if (presentationStarted) {
      stopPresentation()
    } else {
      startPresentation(currentFrame.id)
    }
  }

  useHotkeys(
    KeyboardShortcuts.Live.startAndStopPresentation.key,
    handlePresentationToggle,
    { enabled: isHost }
  )

  // Allow only host to control the presentation
  if (!isHost) return null

  if (!currentFrame) return null

  const presentationStarted =
    presentationStatus === PresentationStatuses.STARTED

  return (
    <div className="flex justify-end items-center -mx-2">
      <Button
        isIconOnly
        size="sm"
        className="live-button"
        variant="light"
        disableRipple
        disableAnimation
        onClick={previousFrame}>
        <IoIosArrowBack size={18} />
      </Button>
      <FrameSmartControlsPopover
        trigger={
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
        }
      />
      <Button
        isIconOnly
        size="sm"
        className="live-button"
        variant="light"
        disableRipple
        disableAnimation
        onClick={nextFrame}>
        <IoIosArrowForward size={18} />
      </Button>
    </div>
  )
}
