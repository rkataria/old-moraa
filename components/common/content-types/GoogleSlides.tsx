'use client'

import React from 'react'

import { GoogleSlideEmbed } from '@/components/common/GoogleSlideEmbed'
import { IFrame } from '@/types/frame.type'

export type GoogleSlidesType = IFrame & {
  content: {
    googleSlideURL: string
    startPosition?: number
  }
}

interface GoogleSlidesProps {
  frame: GoogleSlidesType
}

export function GoogleSlides({ frame }: GoogleSlidesProps) {
  const {
    content: { googleSlideURL, startPosition },
  } = frame

  return (
    <GoogleSlideEmbed
      url={googleSlideURL}
      showControls
      startPage={startPosition}
    />
  )
}
