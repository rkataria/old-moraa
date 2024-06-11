/* eslint-disable jsx-a11y/label-has-associated-control */

'use client'

import React, { useContext, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { GoogleSlideEmbed } from '../common/GoogleSlideEmbed'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

interface GoogleSlidesEditorProps {
  frame: IFrame & {
    content: {
      googleSlideURL: string
      startPosition?: number
    }
  }
}

export function GoogleSlidesEditor({ frame }: GoogleSlidesEditorProps) {
  const [googleSlideUrl, setGoogleSlideUrl] = useState(
    frame.content.googleSlideURL || ''
  )
  const [position, setPosition] = useState<number>(
    frame.content.startPosition || 1
  )
  const [isEditMode, setIsEditMode] = useState(!frame.content.googleSlideURL)

  const { updateFrame } = useContext(EventContext) as EventContextType

  const saveGoogleSlidesLink = () => {
    if (
      frame.content.googleSlideURL === googleSlideUrl &&
      frame.content.startPosition === position
    ) {
      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          googleSlideURL: googleSlideUrl,
          startPosition: position,
        },
      },
      frameId: frame.id,
    })
    setIsEditMode(false)
  }

  if (isEditMode) {
    return (
      <div className="flex items-center justify-center flex-col mt-4">
        <div>
          <label htmlFor="slide-url">Google Slide URL</label>
          <Input
            id="slide-url"
            className="w-96 outline-none mb-4"
            placeholder="Enter Google Slide URL"
            onChange={(e) => setGoogleSlideUrl(e.target.value)}
            value={googleSlideUrl}
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
        <Button onClick={saveGoogleSlidesLink}>Embed Slides</Button>
      </div>
    )
  }

  return (
    <GoogleSlideEmbed url={googleSlideUrl} showControls startPage={position} />
  )
}
