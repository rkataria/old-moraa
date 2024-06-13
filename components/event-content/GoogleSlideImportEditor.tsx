'use client'

import React, { useContext, useEffect, useState } from 'react'

import { IconExclamationCircle } from '@tabler/icons-react'

import { Button, Input } from '@nextui-org/react'

import { ContentLoading } from '../common/ContentLoading'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

interface GoogleSlidesImportEditorProps {
  frame: IFrame
}

export function GoogleSlidesImportEditor({
  frame,
}: GoogleSlidesImportEditorProps) {
  const content: Record<string, unknown> = frame.content ?? {}

  const [googleSlideUrl, setGoogleSlideUrl] = useState(
    (content.googleSlideURL as string | undefined) || ''
  )
  const [startPosition, setStartPosition] = useState<number>(
    (content.position as number | undefined) || 1
  )
  const [endPosition, setEndPosition] = useState<number | undefined>(undefined)
  const [isEditMode, setIsEditMode] = useState(!content.googleSlideURL)
  const [isError, setIsError] = useState<boolean>(false)
  const { error, importGoogleSlides } = useContext(
    EventContext
  ) as EventContextType

  useEffect(() => {
    if (error?.frameId === frame.id) {
      setIsError(true)
      setIsEditMode(true)
    }
  }, [error, frame])

  const handleImportGoogleSlides = () => {
    importGoogleSlides({
      frame,
      googleSlideUrl,
      startPosition,
      endPosition,
    })
    setIsEditMode(false)
  }

  if (!isEditMode) {
    return (
      <ContentLoading message="Please wait while we are importing frames. This may take a few minutes!" />
    )
  }

  return (
    <div className="flex justify-center">
      <div className="flex items-center justify-center flex-col mt-4">
        <div>
          <p>Google Slides URL</p>
          <Input
            className="w-96 outline-none mb-4"
            placeholder="Enter Google Slide URL"
            onChange={(e) => setGoogleSlideUrl(e.target.value)}
            value={googleSlideUrl}
          />
        </div>
        <div>
          <p>Presentation start position</p>
          <Input
            className="w-96 outline-none mb-4"
            placeholder="Presentation start position"
            type="number"
            min={1}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={startPosition as any}
            onChange={(e) =>
              setStartPosition(
                // eslint-disable-next-line no-restricted-globals
                isNaN(Number(e.target.value))
                  ? startPosition
                  : Number(e.target.value)
              )
            }
          />
          <p>Presentation end position</p>
          <Input
            className="w-96 outline-none mb-4"
            placeholder="Presentation end position"
            type="number"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={endPosition as any}
            onChange={(e) =>
              setEndPosition(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleImportGoogleSlides}>Import Slides</Button>
        </div>
        {isError && (
          <div className="flex gap-2 mt-4 bg-red-100 border border-red-300 px-4 py-3 rounded-md">
            <IconExclamationCircle />
            {error?.message}
          </div>
        )}
      </div>
    </div>
  )
}
