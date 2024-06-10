import { useContext } from 'react'

import { Slide } from './Slide'
import { OverviewSlide } from '../common/OverviewSlide'
import { SlideControls } from '../common/SlideControls'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { getSlideCount } from '@/utils/utils'

export function SlideContainer() {
  const { currentSlide, overviewOpen, sections } = useContext(
    EventContext
  ) as EventContextType

  // If the overview is open, show the overview slide
  if (overviewOpen) {
    return <OverviewSlide />
  }

  const slideCount = getSlideCount(sections)

  // If there are no slides, show a message
  if (slideCount === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-2xl font-semibold">Add a slide to get started</p>
      </div>
    )
  }

  // If the current slide is not set, return null
  if (!currentSlide) return null

  // Render the current slide and slide controls
  return (
    <div
      key={currentSlide.id}
      className="relative w-full h-full"
      style={{
        backgroundColor: currentSlide.config?.backgroundColor || '#eeeeef',
      }}>
      <Slide slide={currentSlide} />
      <SlideControls />
    </div>
  )
}
