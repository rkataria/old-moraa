import { useMemo } from 'react'

import { Frame } from './Frame'
import { SectionOverview } from '../common/SectionOverview'

import { useEventContext } from '@/contexts/EventContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { ContentType } from '@/utils/content.util'
import { getFrameCount } from '@/utils/utils'

export function FrameContainer() {
  const { currentFrame, sections, currentSectionId } = useEventContext()
  const frameCount = useMemo(() => getFrameCount(sections), [sections])

  // If the current section is set, return section overview page
  if (currentSectionId) {
    return <SectionOverview />
  }

  // If there are no frames, show a message
  if (frameCount === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-2xl font-semibold">Add a frame to get started</p>
      </div>
    )
  }

  // If the current frame is not set, return null
  if (!currentFrame) return null

  // Render the current frame and frame controls
  return (
    <div key={currentFrame.id} className="relative w-full h-full">
      {currentFrame?.type === ContentType.MORAA_BOARD ? (
        <RoomProvider>
          <Frame frame={currentFrame} />
        </RoomProvider>
      ) : (
        <Frame frame={currentFrame} />
      )}
    </div>
  )
}
