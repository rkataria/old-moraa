// TODO: fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { Cover } from './content-types/Cover'
import { GoogleSlides } from './content-types/GoogleSlides'
import { Poll } from './content-types/Poll'
import { Reflection } from './content-types/Reflection'
import { TextImage } from './content-types/TextImage'
import { VideoEmbed } from './content-types/VideoEmbed'
import { ContentLoading } from '../common/ContentLoading'
import { ImageViewer } from '../common/ImageViewer'
import { MiroEmbed } from '../common/MiroEmbed'

import { ContentType } from '@/components/common/ContentTypePicker'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'
import { checkVoted } from '@/utils/content.util'
import { getOjectPublicUrl } from '@/utils/utils'

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
    onVote,
    addReflection,
    updateReflection,
    currentSlideResponses,
    currentSlideLoading,
    isHost,
  } = useContext(EventSessionContext) as EventSessionContextType
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentSlide) return

    document.documentElement.style.setProperty(
      '--slide-bg-color',
      currentSlide?.config.backgroundColor || 'rgb(17 24 39)'
    )
  }, [currentSlide])

  if (presentationStatus === PresentationStatuses.STOPPED) return null

  if (!currentSlide) return null

  if (currentSlide.type === ContentType.COVER) {
    return <Cover key={currentSlide.id} slide={currentSlide} />
  }

  if (currentSlideLoading) return <ContentLoading />

  if (currentSlide.type === ContentType.POLL) {
    return (
      <Poll
        key={currentSlide.id}
        slide={currentSlide as any}
        onVote={onVote}
        votes={currentSlideResponses}
        isOwner={isHost}
        voted={checkVoted(currentSlideResponses, currentUser)}
      />
    )
  }

  if (currentSlide.type === ContentType.GOOGLE_SLIDES) {
    return <GoogleSlides key={currentSlide.id} slide={currentSlide as any} />
  }
  if (currentSlide.type === ContentType.PDF_VIEWER) {
    return <PDFViewer key={currentSlide.id} slide={currentSlide as any} />
  }
  if (currentSlide.type === ContentType.REFLECTION) {
    return (
      <Reflection
        key={currentSlide.id}
        slide={currentSlide as any}
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
    return <VideoEmbed key={currentSlide.id} slide={currentSlide as any} />
  }
  if (currentSlide.type === ContentType.TEXT_IMAGE) {
    return <TextImage key={currentSlide.id} slide={currentSlide} />
  }

  if (currentSlide.type === ContentType.IMAGE_VIEWER) {
    return (
      <ImageViewer
        key={currentSlide.id}
        src={getOjectPublicUrl(currentSlide.content?.path as string)}
      />
    )
  }

  if (currentSlide.type === ContentType.MIRO_EMBED) {
    return <MiroEmbed slide={currentSlide as any} />
  }

  return null
}
