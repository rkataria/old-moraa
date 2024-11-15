/* eslint-disable jsx-a11y/control-has-associated-label */

import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'

import { CommonControls } from './CommonControls'
import { Controls, getControls } from './Controls'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { PresentationStatuses } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameSmartControlsPopover({
  trigger,
}: {
  trigger: JSX.Element
}) {
  const currentFrame = useCurrentFrame()
  const { presentationStatus } = useEventSession()
  const controls = getControls(currentFrame?.type as FrameType)

  if (!controls) return trigger

  return (
    <Popover
      placement="bottom"
      offset={12}
      isOpen={presentationStatus === PresentationStatuses.STARTED}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className="p-0 w-fit">
        <div className="p-2 h-11">
          <div className="flex justify-start items-center gap-2">
            <Controls />
            <CommonControls />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
