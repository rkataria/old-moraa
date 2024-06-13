import { useContext } from 'react'

import { Frame } from './Frame'
import { FrameControls } from '../common/FrameControls'
import { OverviewFrame } from '../common/OverviewFrame'
import { SectionOverview } from '../common/SectionOverview'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { getFrameCount } from '@/utils/utils'

export function FrameContainer() {
  const { currentFrame, overviewOpen, sections, currentSectionId } = useContext(
    EventContext
  ) as EventContextType

  // If the overview is open, show the overview frame
  if (overviewOpen) {
    return <OverviewFrame />
  }

  // If the current section is set, return section overview page
  if (currentSectionId) {
    return <SectionOverview />
  }

  const frameCount = getFrameCount(sections)

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
    <div
      key={currentFrame.id}
      className="relative w-full h-full"
      style={{
        backgroundColor: currentFrame.config?.backgroundColor || '#ffffff',
      }}>
      <Frame frame={currentFrame} />
      <FrameControls />
    </div>
  )
}
