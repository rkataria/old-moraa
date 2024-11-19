/* eslint-disable jsx-a11y/control-has-associated-label */

import { CommonControls } from './CommonControls'
import { Controls, getControls } from './Controls'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { PresentationStatuses } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameSmartControls() {
  const currentFrame = useCurrentFrame()
  const { presentationStatus } = useEventSession()
  const controls = getControls(currentFrame?.type as FrameType)

  if (!controls) return null

  if (presentationStatus === PresentationStatuses.STARTED) {
    return (
      <div className="p-2 h-11 absolute top-[-51px] left-[50%] translate-x-[-50%] bg-white rounded-lg">
        <div className="flex justify-start items-center gap-2">
          <Controls />
          <CommonControls />
        </div>
      </div>
    )
  }

  // return (
  //   <Popover
  //     placement="bottom"
  //     offset={12}
  //     isOpen={presentationStatus === PresentationStatuses.STARTED}>
  //     <PopoverTrigger>{trigger}</PopoverTrigger>
  //     <PopoverContent className="p-0 w-fit">
  //       <div className="p-2 h-11">
  //         <div className="flex justify-start items-center gap-2">
  //           <Controls />
  //           <CommonControls />
  //         </div>
  //       </div>
  //     </PopoverContent>
  //   </Popover>
  // )
}
