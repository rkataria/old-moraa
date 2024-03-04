/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

import clsx from 'clsx'

import { ISlide } from '@/types/slide.type'

interface IMiniSlideManagerProps {
  isHost?: boolean
  visible?: boolean
  slides: ISlide[]
  currentSlide: ISlide | null
  setCurrentSlide: (slide: ISlide) => void
}

export function MiniSlideManager({
  isHost,
  visible = true,
  slides,
  currentSlide,
  setCurrentSlide,
}: IMiniSlideManagerProps) {
  return (
    <div
      className={clsx('bg-white/95 transition-all duration-200 relative', {
        'w-72 opacity-1': visible,
        'w-0 opacity-0': !visible,
      })}>
      <div className="absolute left-0 top-0 flex flex-col justify-start items-center gap-4 h-full w-full pt-4 px-2 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-auto pb-8">
        {slides.map((slide, index) => (
          <div
            data-minislide-id={slide.id}
            key={`mini-slide-${slide.id}`}
            className="flex justify-start items-center gap-2 w-full">
            <span className="w-5">{index + 1}.</span>
            <div
              onClick={() => {
                if (isHost) setCurrentSlide(slide)
              }}
              className={clsx(
                'relative rounded-md flex-auto w-full aspect-video transition-all border-2 flex justify-center items-center capitalize',
                {
                  'cursor-pointer': isHost,
                  'drop-shadow-md border-black': currentSlide?.id === slide.id,
                  'drop-shadow-none border-black/20':
                    currentSlide?.id !== slide.id,
                }
              )}
              style={{
                backgroundColor: slide.config?.backgroundColor || '#166534',
              }}>
              {slide.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
