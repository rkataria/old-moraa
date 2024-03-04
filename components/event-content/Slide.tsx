'use client'

import React from 'react'

import dynamic from 'next/dynamic'

import { ContentType } from './ContentTypePicker'
import { CoverEditor } from './CoverEditor'
import { GoogleSlidesEditor } from './GoogleSlidesEditor'
import { PollEditor } from './PollEditor'
import { ReflectionEditor } from './ReflectionEditor'
import { VideoEmbedEditor } from './VideoEmbedEditor'

import { ISlide } from '@/types/slide.type'
import { cn } from '@/utils/utils'

const PDFUploader = dynamic(
  () => import('./PDFUploader').then((mod) => mod.PDFUploader),
  {
    ssr: false,
  }
)

interface SlideProps {
  isOwner: boolean
  slide: ISlide
}

export function Slide({ isOwner = false, slide }: SlideProps) {
  return (
    <div
      className={cn('relative group w-full h-full', {
        'pointer-events-none': !isOwner,
      })}>
      <div
        className={cn('relative left-0 w-full', {
          hidden: !isOwner,
        })}
      />
      <div
        data-slide-id={slide.id}
        className="relative w-full h-full rounded-md overflow-auto transition-all">
        {slide.type === ContentType.POLL && (
          <PollEditor slide={slide} openSettings={false} />
        )}
        {slide.type === ContentType.COVER && <CoverEditor slide={slide} />}
        {slide.type === ContentType.GOOGLE_SLIDES && (
          <GoogleSlidesEditor slide={slide} />
        )}
        {slide.type === ContentType.REFLECTION && (
          <ReflectionEditor slide={slide} />
        )}
        {slide.type === ContentType.PDF_VIEWER && <PDFUploader slide={slide} />}
        {slide.type === ContentType.VIDEO_EMBED && (
          <VideoEmbedEditor slide={slide} />
        )}
      </div>
    </div>
  )
}
