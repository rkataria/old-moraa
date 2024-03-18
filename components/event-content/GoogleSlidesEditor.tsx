/* eslint-disable jsx-a11y/label-has-associated-control */

'use client'

import React, { useContext, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { GoogleSlideEmbed } from '../common/GoogleSlideEmbed'

import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'

interface GoogleSlidesEditorProps {
  slide: ISlide & {
    content: {
      googleSlideURL: string
      position?: number
    }
  }
}

export function GoogleSlidesEditor({ slide }: GoogleSlidesEditorProps) {
  const [slideLink, setSlideLink] = useState(slide.content.googleSlideURL || '')
  const [position, setPosition] = useState<number>(slide.content.position || 1)
  const [isEditMode, setIsEditMode] = useState(!slide.content.googleSlideURL)
  const { updateSlide } = useContext(
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

  if (isEditMode) {
    return (
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
    )
  }

  return <GoogleSlideEmbed url={slideLink} showControls startPage={position} />
}
