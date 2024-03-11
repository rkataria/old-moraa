/* eslint-disable jsx-a11y/label-has-associated-control */

'use client'

import React, { useContext, useState } from 'react'

import ReactGoogleSlides from 'react-google-slides'

import { Button, Input, Skeleton } from '@nextui-org/react'

import { NextPrevButtons } from '../common/NextPrevButtons'

import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'
import { cn } from '@/utils/utils'

interface GoogleSlidesEditorProps {
  slide: ISlide & {
    content: {
      googleSlideURL: string
      position?: number
    }
  }
}

export function GoogleSlidesEditor({ slide }: GoogleSlidesEditorProps) {
  const [googleSlidesLoaded, setGoogleSlidesLoaded] = useState<boolean>(false)
  const [slideLink, setSlideLink] = useState(slide.content.googleSlideURL || '')
  const [position, setPosition] = useState<number>(slide.content.position || 1)
  const [isEditMode, setIsEditMode] = useState(!slide.content.googleSlideURL)
  const { updateSlide, isOwner } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const saveGoogleSlidesLink = () => {
    updateSlide({
      ...slide,
      content: {
        googleSlideURL: slideLink,
        startPosition: position,
      },
    })
    setIsEditMode(false)
  }

  return (
    <div className="flex justify-center">
      {isEditMode ? (
        <div className="flex items-center justify-center flex-col mt-4">
          <div>
            <label htmlFor="slide-url">Google slide URL</label>
            <Input
              id="slide-url"
              className="w-96 outline-none mb-4"
              placeholder="Enter Google slide URL"
              onChange={(e) => setSlideLink(e.target.value)}
              value={slideLink}
            />
          </div>
          <div>
            <label>Presentation start position</label>
            <Input
              className="w-96 outline-none mb-4"
              placeholder="Presentation start position"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value={position as any}
              onChange={(e) =>
                setPosition(
                  Number.isNaN(Number(e.target.value))
                    ? position
                    : Number(e.target.value)
                )
              }
            />
          </div>
          <Button className="mt-4" onClick={saveGoogleSlidesLink}>
            Embed Slides
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative aspect-video h-[520px] m-auto overflow-hidden">
            {!googleSlidesLoaded && (
              <Skeleton className="absolute left-0 top-0 w-full h-full rounded-md" />
            )}
            <ReactGoogleSlides
              className={cn('aspect-video m-auto', {
                'bg-gray-200': !googleSlidesLoaded,
              })}
              width="auto"
              height={520}
              slidesLink={slideLink}
              position={position}
              onLoad={() => {
                setGoogleSlidesLoaded(true)
              }}
            />
          </div>
          {isOwner && (
            <NextPrevButtons
              onPrevious={() => setPosition((pos) => (pos > 1 ? pos - 1 : pos))}
              onNext={() => setPosition((pos) => pos + 1)}
              prevDisabled={position === 1}
            />
          )}
        </div>
      )}
    </div>
  )
}
