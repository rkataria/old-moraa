// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react'

import { GoogleSlides, GoogleSlidesType } from './content-types/GoogleSlides'
import { MoraaBoard, MoraaBoardSlide } from './content-types/MoraaBoard'
import { PDFViewer, PDFViewerSlideType } from './content-types/PDFViewer'
import { type TextImageSlideType } from './content-types/TextImage'
import {
  MiroEmbedEditor,
  MiroEmbedSlideType,
} from '../event-content/MiroEmbedEditor'
import { ReflectionEditor } from '../event-content/ReflectionEditor'
import {
  VideoEmbedEditor,
  VideoEmbedSlideType,
} from '../event-content/VideoEmbedEditor'
import { RichText } from '../event-session/content-types/RichText'
import { TextImage } from '../event-session/content-types/TextImage'

import {
  Cover,
  type CoverSlideType,
} from '@/components/common/content-types/Cover'
import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { Poll, type PollSlide } from '@/components/common/content-types/Poll'
import { ContentType } from '@/components/common/ContentTypePicker'
import { ISlide } from '@/types/slide.type'
import { cn, getOjectPublicUrl } from '@/utils/utils'

interface SlideProps {
  slide: ISlide
}

export function SlidePreview({ slide }: SlideProps) {
  useEffect(() => {
    if (!slide) return

    document.documentElement.style.setProperty(
      '--slide-bg-color',
      slide?.config.backgroundColor || 'rgb(17 24 39)'
    )
  }, [slide])

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className={cn('relative group w-full h-full p-4')}>
      <div
        data-slide-id={slide.id}
        className="relative w-full h-full rounded-md overflow-auto transition-all">
        {slide.type === ContentType.COVER && (
          <Cover slide={slide as CoverSlideType} />
        )}
        {slide.type === ContentType.TEXT_IMAGE && (
          <TextImage slide={slide as TextImageSlideType} />
        )}
        {slide.type === ContentType.GOOGLE_SLIDES && (
          <GoogleSlides slide={slide as GoogleSlidesType} />
        )}
        {slide.type === ContentType.IMAGE_VIEWER && (
          <ImageViewer src={getOjectPublicUrl(slide.content?.path as string)} />
        )}
        {slide.type === ContentType.PDF_VIEWER && (
          <PDFViewer slide={slide as PDFViewerSlideType} />
        )}
        {slide.type === ContentType.POLL && (
          <Poll slide={slide as PollSlide} votes={[]} voted={false} />
        )}
        {slide.type === ContentType.GOOGLE_SLIDES_IMPORT && (
          <div className="w-full h-full flex justify-center items-center">
            <p>
              This slide will be replaced with the imported Google Slides once
              the import is completed.
            </p>
          </div>
        )}
        {slide.type === ContentType.REFLECTION && (
          <ReflectionEditor slide={slide} />
        )}

        {slide.type === ContentType.VIDEO_EMBED && (
          <VideoEmbedEditor slide={slide as VideoEmbedSlideType} />
        )}
        {slide.type === ContentType.MIRO_EMBED && (
          <MiroEmbedEditor slide={slide as MiroEmbedSlideType} />
        )}
        {slide.type === ContentType.RICH_TEXT && <RichText slide={slide} />}
        {slide.type === ContentType.MORAA_BOARD && (
          <MoraaBoard slide={slide as MoraaBoardSlide} />
        )}
      </div>
    </div>
  )
}
