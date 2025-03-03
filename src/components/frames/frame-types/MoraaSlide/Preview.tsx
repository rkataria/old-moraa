/* eslint-disable react/no-danger */

import { LoadFonts } from './LoadFonts'

import { type MoraaSlideFrame } from '@/types/frame-picker.type'

interface PreviewProps {
  frame: MoraaSlideFrame
}

export function Preview({ frame }: PreviewProps) {
  const { svg } = frame.content

  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoadFonts />
      <div
        className="relative w-full h-fit aspect-video moraa-slide-preview rounded-md overflow-hidden border-1 border-gray-200"
        dangerouslySetInnerHTML={{
          __html: svg || '',
        }}
      />
    </div>
  )
}
