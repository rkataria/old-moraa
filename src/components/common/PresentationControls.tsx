import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { RiPlayCircleFill, RiStopCircleFill } from 'react-icons/ri'

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

  if (!currentFrame) return <div />

  const presentationStarted =
    presentationStatus === PresentationStatuses.STARTED

  return (
    <div className="flex justify-end items-center gap-2">
      <Button
        isIconOnly
        size="sm"
        className="live-button"
        variant="light"
        onClick={previousFrame}>
        <IoIosArrowBack size={20} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        className={cn('rounded-md bg-white scale-150 hover:bg-transparent')}
        variant="light"
        onClick={handlePresentationToggle}>
        {presentationStarted ? (
          <RiStopCircleFill size={28} className="text-red-500" />
        ) : (
          <RiPlayCircleFill size={28} className="text-green-500" />
        )}
      </Button>
      <Button
        isIconOnly
        size="sm"
        className="live-button"
        variant="light"
        onClick={nextFrame}>
        <IoIosArrowForward size={20} />
      </Button>
    </div>
  )
}
