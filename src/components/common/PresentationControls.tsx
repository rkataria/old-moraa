import { motion } from 'framer-motion'
import {
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
  RiPlayCircleFill,
  RiStopCircleFill,
} from 'react-icons/ri'

import { ContentTypeIcon } from './ContentTypeIcon'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

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

  if (!currentFrame) return <div />

  const presentationStarted =
    presentationStatus === PresentationStatuses.STARTED

  return (
    <div className="flex justify-between items-center gap-2 p-2 pl-4 h-10 bg-gray-100 rounded-full">
      <motion.div className="flex justify-start items-center gap-2">
        <ContentTypeIcon
          frameType={currentFrame.type}
          classNames="text-black"
        />
        <span className="font-semibold w-44 text-ellipsis overflow-hidden">
          {currentFrame.name}
        </span>
      </motion.div>
      {isHost && (
        <div className="flex justify-end items-center">
          <Button
            isIconOnly
            className="rounded-full"
            variant="light"
            onClick={previousFrame}>
            <RiArrowLeftDoubleLine size={18} />
          </Button>
          <Button
            isIconOnly
            className={cn('rounded-full')}
            variant="light"
            onClick={() => {
              if (presentationStarted) {
                stopPresentation()
              } else {
                startPresentation(currentFrame.id)
              }
            }}>
            {presentationStarted ? (
              <RiStopCircleFill size={28} className="text-red-500" />
            ) : (
              <RiPlayCircleFill size={28} className="text-green-500" />
            )}
          </Button>
          <Button
            isIconOnly
            className="rounded-full"
            variant="light"
            onClick={nextFrame}>
            <RiArrowRightDoubleLine size={18} />
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
