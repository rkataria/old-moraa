/* eslint-disable @typescript-eslint/no-explicit-any */

import { FrameContainer } from '@/components/event-content/FrameContainer'
import { useEventContext } from '@/contexts/EventContext'
import { FrameType } from '@/utils/frame-picker.util'

const framesWithVideoAspectRatio = [
  FrameType.VIDEO,
  FrameType.MORAA_BOARD,
  FrameType.MIRO_EMBED,
  FrameType.IMAGE_VIEWER,
  FrameType.MORAA_SLIDE,
  FrameType.GOOGLE_SLIDES,
  FrameType.VIDEO_EMBED,
]

export function ContentStudioFrameContainer() {
  const { currentFrame } = useEventContext()

  const renderFrame = () => {
    if (
      currentFrame &&
      framesWithVideoAspectRatio.includes(currentFrame.type)
    ) {
      return (
        <div className="relative w-full pt-[56.25%]">
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <FrameContainer />
          </div>
        </div>
      )
    }

    return <FrameContainer />
  }

  return (
    <div className="w-full h-full rounded-md overflow-hidden overflow-y-auto scrollbar-thin bg-white">
      {renderFrame()}
    </div>
  )
}
