'use client'

import React, { useContext, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { ContentLoading } from '../common/ContentLoading'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

interface GoogleSlidesImportEditorProps {
  slide: ISlide
}

export function GoogleSlidesImportEditor({
  slide,
}: GoogleSlidesImportEditorProps) {
  const content: Record<string, unknown> = slide.content ?? {}

  const [slideLink, setSlideLink] = useState(
    (content.googleSlideURL as string | undefined) || ''
  )
  const [position, setPosition] = useState<number>(
    (content.position as number | undefined) || 1
  )
  const [isEditMode, setIsEditMode] = useState(!content.googleSlideURL)
  const { importGoogleSlides } = useContext(EventContext) as EventContextType

  const handleImportGoogleSlides = () => {
    importGoogleSlides({
      slide,
      googleSlideUrl: slideLink,
      startPosition: position,
    })
    setIsEditMode(false)
  }

  if (!isEditMode) {
    return (
      <ContentLoading message="Please wait while we are importing slides..." />
    )
  }

  return (
    <div className="flex justify-center">
      <div className="flex items-center justify-center flex-col mt-4">
        <div>
          <p>Google slide URL</p>
          <Input
            className="w-96 outline-none mb-4"
            placeholder="Enter Google slide URL"
            onChange={(e) => setSlideLink(e.target.value)}
            value={slideLink}
          />
        </div>
        <div>
          <p>Presentation start position</p>
          <Input
            className="w-96 outline-none mb-4"
            placeholder="Presentation start position"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={position as any}
            onChange={(e) =>
              setPosition(
                // eslint-disable-next-line no-restricted-globals
                isNaN(Number(e.target.value))
                  ? position
                  : Number(e.target.value)
              )
            }
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleImportGoogleSlides}>Import Slides</Button>
        </div>
      </div>
    </div>
  )
}
