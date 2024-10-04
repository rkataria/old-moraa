import { useContext, useMemo } from 'react'

import { Button, ButtonGroup } from '@nextui-org/react'
import { IoStop } from 'react-icons/io5'

import { Tooltip } from './ShortuctTooltip'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { getNextFrame, getPreviousFrame } from '@/utils/event-session.utils'
import { cn } from '@/utils/utils'

export function PresentationControls({
  onPrevious,
  onNext,
  switchPublishedFrames = false,
  onStop,
}: {
  onPrevious?: () => void
  onNext?: () => void
  switchPublishedFrames?: boolean
  onStop: () => void
}) {
  const { sections, currentFrame, setCurrentFrame, eventMode } = useContext(
    EventContext
  ) as EventContextType

  const previousFrame = useMemo(
    () =>
      getPreviousFrame({
        sections,
        currentFrame,
        onlyPublished: switchPublishedFrames && eventMode !== 'present',
      }),
    [sections, currentFrame, switchPublishedFrames, eventMode]
  )
  const nextFrame = useMemo(
    () =>
      getNextFrame({
        sections,
        currentFrame,
        onlyPublished: switchPublishedFrames && eventMode !== 'present',
      }),
    [sections, currentFrame, switchPublishedFrames, eventMode]
  )

  const handlePrevious = () => {
    if (eventMode === 'present') onPrevious?.()

    if (previousFrame) setCurrentFrame(previousFrame)
  }

  const handleNext = () => {
    if (eventMode === 'present') onNext?.()

    if (nextFrame) setCurrentFrame(nextFrame)
  }

  return (
    <ButtonGroup
      radius="sm"
      size="sm"
      fullWidth
      className="p-1 bg-gray-100 rounded-lg">
      <Tooltip content="Previous frame" placement="bottom">
        <Button
          size="sm"
          className={cn(
            'font-semibold rounded-md bg-gray-100 hover:bg-gray-200',
            {
              'text-gray-500 hover:bg-gray-100': !previousFrame,
            }
          )}
          disabled={!previousFrame}
          onClick={handlePrevious}>
          Prev
        </Button>
      </Tooltip>
      <Tooltip content="Stop presentation" placement="bottom">
        <Button
          size="sm"
          className="font-semibold rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={onStop}>
          <IoStop size={18} className="flex-none" />
          Stop
        </Button>
      </Tooltip>
      <Tooltip content="Next frame" placement="bottom">
        <Button
          size="sm"
          className={cn(
            'font-semibold rounded-md bg-gray-100 hover:bg-gray-200',
            {
              'text-gray-500 hover:bg-gray-100': !nextFrame,
            }
          )}
          disabled={!nextFrame}
          onClick={handleNext}>
          Next
        </Button>
      </Tooltip>
    </ButtonGroup>
  )
}
