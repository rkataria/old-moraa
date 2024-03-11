import React, { useContext } from 'react'

import { Cover } from './content-types/Cover'
import { Poll } from './content-types/Poll'
import { ContentType } from '../event-content/ContentTypePicker'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { EventSessionContextType } from '@/types/event-session.type'
import { checkVoted } from '@/utils/content.util'

export function PresentationSlide() {
  const { currentSlide, currentSlideResponses, votePoll } = useContext(
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
          votePoll={votePoll}
          votes={currentSlideResponses}
          voted={checkVoted(currentSlideResponses, currentUser)}
        />
      )}
    </div>
  )
}
