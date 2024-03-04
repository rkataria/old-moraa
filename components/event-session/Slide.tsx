import React, { useContext } from 'react'

import dynamic from 'next/dynamic'

import { Cover } from './content-types/Cover'
import { GoogleSlides } from './content-types/GoogleSlides'
import { Poll } from './content-types/Poll'
import { Reflection } from './content-types/Reflection'
import { VideoEmbed } from './content-types/VideoEmbed'
import { SlideLoading } from './SlideLoading'
import { ContentType } from '../event-content/ContentTypePicker'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'
import { checkVoted } from '@/utils/content.util'

const PDFViewer = dynamic(
  () => import('./content-types/PDFViewer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
  }
)

export function Slide() {
  const {
    presentationStatus,
    currentSlide,
    votePoll,
    addReflection,
    updateReflection,
    currentSlideResponses,
    currentSlideLoading,
    isHost,
  } = useContext(EventSessionContext) as EventSessionContextType
  const { currentUser } = useAuth()

  if (presentationStatus === PresentationStatuses.STOPPED) return null

  if (!currentSlide) return null

  if (currentSlide.type === ContentType.COVER) {
    return <Cover key={currentSlide.id} slide={currentSlide} />
  }

  if (currentSlideLoading) return <SlideLoading />

  if (currentSlide.type === ContentType.POLL) {
    return (
      <Poll
        key={currentSlide.id}
        slide={currentSlide}
        votePoll={votePoll}
        votes={currentSlideResponses}
        isHost={isHost}
        voted={checkVoted(currentSlideResponses, currentUser)}
      />
    )
  }

  if (currentSlide.type === ContentType.GOOGLE_SLIDES) {
    return <GoogleSlides key={currentSlide.id} slide={currentSlide} />
  }
  if (currentSlide.type === ContentType.PDF_VIEWER) {
    return <PDFViewer key={currentSlide.id} slide={currentSlide} />
  }
  if (currentSlide.type === ContentType.REFLECTION) {
    return (
      <Reflection
        key={currentSlide.id}
        slide={currentSlide}
        responses={currentSlideResponses}
        responded={checkVoted(currentSlideResponses, currentUser)}
        user={currentUser}
        isHost={isHost}
        addReflection={addReflection}
        updateReflection={updateReflection}
      />
    )
  }
  if (currentSlide.type === ContentType.VIDEO_EMBED) {
    return <VideoEmbed key={currentSlide.id} slide={currentSlide} />
  }

  return null
}
