import { useContext, useState } from 'react'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react'
import { Duration, DurationObjectUnits } from 'luxon'
import { IoCloseCircle, IoTimeOutline } from 'react-icons/io5'

import { Minutes } from './Minutes'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

export function SectionTime({
  sectionId,
  frames,
  config,
}: {
  sectionId: string
  frames: IFrame[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
}) {
  const [isOpen, setIsOpen] = useState(false)

  const { updateSection } = useContext(EventContext) as EventContextType

  const minutesToHours = (totalMinutes: number) => {
    const duration = Duration.fromObject({
      minutes: totalMinutes,
    })
    const hours = Math.floor(duration.as('hours'))
    const minutes = duration.minus({ hours }).as('minutes')

    return {
      hours,
      minutes,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function calculateTotalTime(frames: IFrame[]) {
    let totalTime = 0

    frames.forEach((frame) => {
      if (frame?.config && typeof frame?.config?.time === 'number') {
        totalTime += frame.config.time
      }
    })

    return totalTime
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getTotalFramesTime = (frames: IFrame[]) =>
    minutesToHours(calculateTotalTime(frames))

  const updateSectionTime = (updatedTime: number) => {
    updateSection({
      sectionPayload: {
        config: {
          ...config,
          time: updatedTime,
        },
      },
      sectionId,
    })
  }

  const timeofAllFrames = getTotalFramesTime(frames)

  const sectionTime = minutesToHours(config?.time || 0)

  function getTimeDifference(
    planned: DurationObjectUnits,
    actual: DurationObjectUnits
  ) {
    const duration1 = Duration.fromObject({
      hours: planned.hours,
      minutes: planned.minutes,
    })
    const duration2 = Duration.fromObject({
      hours: actual.hours,
      minutes: actual.minutes,
    })

    let difference = duration1.minus(duration2)

    const isFirstGreater =
      duration1.as('milliseconds') > duration2.as('milliseconds')

    const isEqual =
      duration1.as('milliseconds') === duration2.as('milliseconds')

    if (difference.as('milliseconds') < 0) {
      difference = Duration.fromMillis(-difference.as('milliseconds'))
    }

    const totalMinutes = difference.as('minutes')
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.floor(totalMinutes % 60)

    return {
      hours,
      minutes,
      isFirstGreater,
      isEqual,
    }
  }

  const timeDifference = getTimeDifference(sectionTime, timeofAllFrames)

  return (
    <div className="flex items-center mt-0.5 gap-2">
      <RenderIf isTrue={timeDifference.isFirstGreater && config?.time}>
        <Tooltip
          color="warning"
          content={`Actual time is less than planned time by ${timeDifference.hours}h ${timeDifference.minutes}m.`}
          radius="sm">
          <Button
            isIconOnly
            className="w-6 h-6 min-w-6 hover:bg-transparent"
            variant="light">
            <IoTimeOutline className="text-lg text-white bg-gray-500 rounded-full" />
          </Button>
        </Tooltip>
      </RenderIf>
      <RenderIf
        isTrue={
          !timeDifference.isFirstGreater &&
          !timeDifference.isEqual &&
          config?.time
        }>
        <Tooltip
          color="danger"
          content={`Actual time is exceeding planned time by ${timeDifference.hours}h ${timeDifference.minutes}m. Please align the times correctly.`}
          radius="sm">
          <Button
            isIconOnly
            className="w-6 h-6 min-w-6 hover:bg-transparent"
            variant="light">
            <IoCloseCircle className="text-xl text-red-500" />
          </Button>
        </Tooltip>
      </RenderIf>
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger>
          <p className="text-xs font-semibold cursor-pointer text-primary-300">
            {`${sectionTime.hours}h ${sectionTime.minutes}m`}
          </p>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <Minutes minutes={config?.time || 0} onChange={updateSectionTime} />
          </div>
        </PopoverContent>
      </Popover>
      /
      <p className="text-xs font-normal text-gray-400">{`(${timeofAllFrames.hours}h ${timeofAllFrames.minutes}m)`}</p>
    </div>
  )
}
