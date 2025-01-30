import { useContext, useState } from 'react'

import {
  Button,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { Duration, DurationObjectUnits } from 'luxon'
import { BiExpandAlt } from 'react-icons/bi'
import { IoCloseCircle, IoTimeOutline } from 'react-icons/io5'

import { Minutes } from './Minutes'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function SectionTime({
  sectionId,
  frames,
  config,
  editable = true,
  className = '',
}: {
  sectionId: string
  frames: IFrame[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
  editable?: boolean
  className?: string
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
      if (
        frame?.config &&
        typeof frame?.config?.time === 'number' &&
        frame.type !== FrameType.BREAKOUT
      ) {
        totalTime += frame.config?.time || 0

        return
      }
      if (
        frame?.config &&
        typeof frame?.config?.breakoutDuration === 'number'
      ) {
        totalTime += frame.config?.breakoutDuration || 0
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
    <div className={cn('flex items-center gap-2', className)}>
      <Popover
        placement="bottom"
        isOpen={isOpen && editable}
        onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger>
          <Chip
            size="sm"
            radius="sm"
            className="bg-transparent text-xs cursor-pointer gap-1"
            startContent={
              editable ? <BiExpandAlt className="rotate-[-45deg]" /> : null
            }>
            Planned{' '}
            <span className="font-semibold ml-2 text-xs">
              {' '}
              {`${sectionTime.hours}h ${sectionTime.minutes}m`}
            </span>
          </Chip>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <Minutes
              minutes={config?.time || 0}
              onChange={updateSectionTime}
              inputProps={{ autoFocus: true }}
            />
          </div>
        </PopoverContent>
      </Popover>

      <Chip
        size="sm"
        radius="sm"
        className="bg-transparent text-xs cursor-pointer gap-1">
        Calculated{' '}
        <span className="font-semibold ml-2">{`${timeofAllFrames.hours}h ${timeofAllFrames.minutes}m`}</span>
      </Chip>
      <RenderIf isTrue={timeDifference.isFirstGreater && config?.time}>
        <Tooltip
          color="warning"
          content={`Calculated time is less than planned time by ${timeDifference.hours}h ${timeDifference.minutes}m.`}
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
          content={`Calculated time is exceeding planned time by ${timeDifference.hours}h ${timeDifference.minutes}m. Please align the times correctly.`}
          radius="sm">
          <IoCloseCircle className="text-xl text-red-500" />
        </Tooltip>
      </RenderIf>
    </div>
  )
}
