import React, { useContext } from 'react'

import { Cover } from './content-types/Cover'
import { Poll, type Vote } from './content-types/Poll'

import { ContentType } from '@/components/common/ContentTypePicker'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { type EventSessionContextType } from '@/types/event-session.type'
import { checkVoted } from '@/utils/content.util'

export function PresentationSlide() {
  const { currentSlide, currentSlideResponses } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const { currentUser } = useAuth()

  if (!currentSlide) return null

  return (
    <div className="w-full h-full">
      {currentSlide.type === ContentType.COVER && (
        <Cover key={currentSlide.id} slide={currentSlide} />
      )}
      {currentSlide.type === ContentType.POLL && (
        <Poll
          key={currentSlide.id}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          slide={currentSlide as any}
          votes={currentSlideResponses as Vote[]}
          voted={checkVoted(currentSlideResponses, currentUser)}
        />
      )}
    </div>
  )
}
