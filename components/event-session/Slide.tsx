// TODO: fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { GoogleSlides } from './content-types/GoogleSlides'
import { Poll, Vote } from './content-types/Poll'
import { Reflection } from './content-types/Reflection'
import { RichText } from './content-types/RichText'
import { VideoEmbed } from './content-types/VideoEmbed'
import { MoraaBoardEditor } from '../event-content/content-types/MoraaBoardEditor'

import { Cover } from '@/components/common/content-types/Cover'
import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { MiroEmbed } from '@/components/common/content-types/MiroEmbed'
import { TextImage } from '@/components/common/content-types/TextImage'
import { ContentLoading } from '@/components/common/ContentLoading'
import { ContentType } from '@/components/common/ContentTypePicker'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { EventSessionContextType } from '@/types/event-session.type'
import { type IReflectionSlide } from '@/types/slide.type'
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

    const DEFAULT_SLIDE_BG_COLOR = 'rgb(17 24 39)'

    document.documentElement.style.setProperty(
      '--slide-bg-color',
      currentSlide?.config.backgroundColor || DEFAULT_SLIDE_BG_COLOR
    )
  }, [currentSlide])

  if (!currentSlide) return null

  if (currentSlideLoading) return <ContentLoading />

  const renderersByContentType: Record<ContentType, React.ReactNode> = {
    [ContentType.VIDEO]: null,
    [ContentType.GOOGLE_SLIDES_IMPORT]: null,
    [ContentType.COVER]: (
      <Cover key={currentSlide.id} slide={currentSlide as any} />
    ),
    [ContentType.POLL]: (
      <Poll
        key={currentSlide.id}
        slide={currentSlide as any}
        votes={currentSlideResponses as Vote[]}
        isOwner={isHost}
        voted={checkVoted(currentSlideResponses, currentUser)}
      />
    ),
    [ContentType.GOOGLE_SLIDES]: (
      <GoogleSlides key={currentSlide.id} slide={currentSlide as any} />
    ),
    [ContentType.PDF_VIEWER]: (
      <PDFViewer key={currentSlide.id} slide={currentSlide as any} />
    ),
    [ContentType.REFLECTION]: (
      <Reflection
        key={currentSlide.id}
        slide={currentSlide as IReflectionSlide}
      />
    ),
    [ContentType.VIDEO_EMBED]: (
      <VideoEmbed key={currentSlide.id} slide={currentSlide as any} />
    ),
    [ContentType.TEXT_IMAGE]: (
      <TextImage key={currentSlide.id} slide={currentSlide} />
    ),
    [ContentType.IMAGE_VIEWER]: (
      <ImageViewer
        key={currentSlide.id}
        src={getOjectPublicUrl(currentSlide.content?.path as string)}
      />
    ),
    [ContentType.RICH_TEXT]: (
      <RichText key={currentSlide.id} slide={currentSlide} />
    ),
    [ContentType.MIRO_EMBED]: <MiroEmbed slide={currentSlide as any} />,
    [ContentType.MORAA_BOARD]: <MoraaBoardEditor />,
  }

  const renderer = renderersByContentType[currentSlide.type]

  return renderer
}
