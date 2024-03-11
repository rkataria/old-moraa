// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React from 'react'

import { IconSettings } from '@tabler/icons-react'
import dynamic from 'next/dynamic'

import { CoverEditor } from './content-types/CoverEditor'
import { TextImageEditor } from './content-types/TextImageEditor'
import { ContentType } from './ContentTypePicker'
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
  settingsEnabled?: boolean
  setSettingsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function Slide({
  isOwner = false,
  slide,
  settingsEnabled,
  setSettingsSidebarVisible,
}: SlideProps) {
  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className={cn('relative group w-full h-full', {
        'pointer-events-none': !isOwner,
      })}>
      <div
        className={cn('relative left-0 w-full', {
          hidden: !isOwner,
        })}
      />
      {settingsEnabled && (
        <IconSettings
          className="absolute right-0 top-0 z-[40] m-1 text-slate-300 hover:text-slate-500 duration-100 cursor-pointer"
          onClick={() => setSettingsSidebarVisible(true)}
        />
      )}

      <div
        data-slide-id={slide.id}
        className="relative w-full h-full rounded-md overflow-auto transition-all">
        {slide.type === ContentType.POLL && (
          <PollEditor slide={slide} openSettings={false} />
        )}
        {slide.type === ContentType.COVER && <CoverEditor slide={slide} />}
        {slide.type === ContentType.GOOGLE_SLIDES && (
          <GoogleSlidesEditor slide={slide as any} />
        )}
        {slide.type === ContentType.REFLECTION && (
          <ReflectionEditor slide={slide} />
        )}
        {slide.type === ContentType.PDF_VIEWER && (
          <PDFUploader slide={slide as any} />
        )}
        {slide.type === ContentType.VIDEO_EMBED && (
          <VideoEmbedEditor slide={slide as any} />
        )}
        {slide.type === ContentType.TEXT_IMAGE && (
          <TextImageEditor slide={slide} />
        )}
      </div>
    </div>
  )
}
