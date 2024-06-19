'use client'

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
  const embededUrl =
    frame.content.googleSlideURL || (frame.content.googleSlideUrl as string)

  return (
    <GoogleSlideEmbed
      url={embededUrl}
      showControls={!frame.content?.individualFrame}
      startPage={frame.content.startPosition}
    />
  )
}
