/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentType } from '../ContentTypePicker'

import { FrameContainer } from '@/components/event-content/FrameContainer'
import { useEventContext } from '@/contexts/EventContext'

const framesWithVideoAspectRatio = [
  ContentType.VIDEO,
  ContentType.MORAA_BOARD,
  ContentType.MIRO_EMBED,
  ContentType.IMAGE_VIEWER,
  ContentType.MORAA_SLIDE,
  ContentType.GOOGLE_SLIDES,
  ContentType.GOOGLE_SLIDES_IMPORT,
  ContentType.VIDEO_EMBED,
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
