'use client'

import React from 'react'

import { GoogleSlideEmbed } from '@/components/common/GoogleSlideEmbed'
import { ISlide } from '@/types/slide.type'

export type GoogleSlidesType = ISlide & {
  content: {
    googleSlideURL: string
    startPosition?: number
  }
}

interface GoogleSlidesProps {
  slide: GoogleSlidesType
}

export function GoogleSlides({ slide }: GoogleSlidesProps) {
  const {
    content: { googleSlideURL, startPosition },
  } = slide

  return (
    <GoogleSlideEmbed
      url={googleSlideURL}
      showControls
      startPage={startPosition}
    />
  )
}
