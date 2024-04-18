// TODO: fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { GoogleSlides } from './content-types/GoogleSlides'
import { Poll, Vote } from './content-types/Poll'
import { Reflection } from './content-types/Reflection'
import { RichText } from './content-types/RichText'
import { VideoEmbed } from './content-types/VideoEmbed'

import { Cover } from '@/components/common/content-types/Cover'
import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { MiroEmbed } from '@/components/common/content-types/MiroEmbed'
import { TextImage } from '@/components/common/content-types/TextImage'
import { ContentLoading } from '@/components/common/ContentLoading'
import { ContentType } from '@/components/common/ContentTypePicker'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { EventSessionContextType } from '@/types/event-session.type'
import { checkVoted } from '@/utils/content.util'
import { getOjectPublicUrl } from '@/utils/utils'

const PDFViewer = dynamic(
  () => import('./content-types/PDFViewer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
  }
)

export function Slide() {
  const { currentSlide, currentSlideResponses, currentSlideLoading, isHost } =
    useContext(EventSessionContext) as EventSessionContextType
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentSlide) return

    document.documentElement.style.setProperty(
      '--slide-bg-color',
      currentSlide?.config.backgroundColor || 'rgb(17 24 39)'
    )
  }, [currentSlide])

  if (!currentSlide) return null

  if (currentSlide.type === ContentType.COVER) {
    return <Cover key={currentSlide.id} slide={currentSlide as any} />
  }

  if (currentSlideLoading) return <ContentLoading />

  if (currentSlide.type === ContentType.POLL) {
    return (
      <Poll
        key={currentSlide.id}
        slide={currentSlide as any}
        votes={currentSlideResponses as Vote[]}
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
  if (currentSlide.type === ContentType.RICH_TEXT) {
    return <RichText key={currentSlide.id} slide={currentSlide} />
  }

  if (currentSlide.type === ContentType.MIRO_EMBED) {
    return <MiroEmbed slide={currentSlide as any} />
  }

  return null
}
