import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { RiPlayCircleFill, RiStopCircleFill } from 'react-icons/ri'

import { ContentTypeIcon } from './ContentTypeIcon'
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
    <div className="flex justify-between items-center gap-2 px-2 pl-4 h-12 bg-white rounded-md">
      <motion.div className="flex justify-start items-center gap-2">
        <ContentTypeIcon
          frameType={currentFrame.type}
          classNames="text-black"
        />
        <span
          className="font-semibold w-56 text-ellipsis overflow-hidden line-clamp-1"
          title={currentFrame.name}>
          {currentFrame.name}
        </span>
      </motion.div>
      {isHost && (
        <div className="flex justify-end items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            className="rounded-full bg-white"
            variant="light"
            onClick={previousFrame}>
            <IoIosArrowBack size={18} />
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
            className="rounded-full bg-white"
            variant="light"
            onClick={nextFrame}>
            <IoIosArrowForward size={18} />
          </Button>
        </div>
      )}
    </div>
  )

  // return (
  //   <ButtonGroup
  //     radius="sm"
  //     size="sm"
  //     fullWidth
  //     className="p-1 bg-gray-100 rounded-lg">
  //     <Tooltip content="Previous frame" placement="bottom">
  //       <Button
  //         size="sm"
  //         className={cn(
  //           'font-semibold rounded-md bg-gray-100 hover:bg-gray-200',
  //           {
  //             'text-gray-500 hover:bg-gray-100': !previousFrame,
  //           }
  //         )}
  //         disabled={!previousFrame}
  //         onClick={handlePrevious}>
  //         Prev
  //       </Button>
  //     </Tooltip>
  //     <Tooltip content="Stop presentation" placement="bottom">
  //       <Button
  //         size="sm"
  //         className="font-semibold rounded-md bg-gray-100 hover:bg-gray-200"
  //         onClick={onStop}>
  //         <IoStop size={18} className="flex-none" />
  //         Stop
  //       </Button>
  //     </Tooltip>
  //     <Tooltip content="Next frame" placement="bottom">
  //       <Button
  //         size="sm"
  //         className={cn(
  //           'font-semibold rounded-md bg-gray-100 hover:bg-gray-200',
  //           {
  //             'text-gray-500 hover:bg-gray-100': !nextFrame,
  //           }
  //         )}
  //         disabled={!nextFrame}
  //         onClick={handleNext}>
  //         Next
  //       </Button>
  //     </Tooltip>
  //   </ButtonGroup>
  // )
}
