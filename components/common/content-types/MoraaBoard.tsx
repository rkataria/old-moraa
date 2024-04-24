'use client'

import { Tldraw } from '@tldraw/tldraw'

import { ISlide } from '@/types/slide.type'

export type MoraaBoardSlideType = ISlide & {
  content: {
    snapshot: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlideType
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="w-full h-full flex flex-col justify-center items-center px-4">
      <Tldraw />
    </div>
  )
}
