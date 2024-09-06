/* eslint-disable react/no-danger */

import { LoadFonts } from './LoadFonts'

interface MoraaSlidePreviewProps {
  frameCanvasSvg: string | null
}

export function MoraaSlidePreview({ frameCanvasSvg }: MoraaSlidePreviewProps) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoadFonts />
      <div
        className="relative w-full h-fit aspect-video moraa-slide-preview rounded-md overflow-hidden"
        dangerouslySetInnerHTML={{
          __html: frameCanvasSvg || '',
        }}
      />
    </div>
  )
}
