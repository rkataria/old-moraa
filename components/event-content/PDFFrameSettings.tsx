import React, { useContext, useEffect, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { ContentType } from '../common/ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PDFFrameSettings() {
  const { updateFrame, currentFrame } = useContext(
    EventContext
  ) as EventContextType
  const [defaultPage, setDefaultPage] = useState<null | number>(
    (currentFrame?.content?.defaultPage as number) || 1
  )

  useEffect(() => {
    if (!Number.isNaN(currentFrame?.content?.defaultPage)) {
      setDefaultPage(currentFrame?.content?.defaultPage as number)
    }
  }, [currentFrame?.content?.defaultPage])

  if (!currentFrame || currentFrame.type !== ContentType.PDF_VIEWER) return null

  const saveDefaultPageNumber = () => {
    updateFrame({
      framePayload: {
        content: {
          ...currentFrame.content,
          defaultPage,
        },
      },
      frameId: currentFrame.id,
    })
  }

  return (
    <div>
      <p>Initial page number</p>
      <div className="flex items-center">
        <Input
          placeholder="Initial page number"
          className="mr-2"
          type="number"
          size="sm"
          value={`${defaultPage}`}
          onChange={(e) => {
            setDefaultPage(+e.target.value)
          }}
        />
        <Button size="sm" onClick={saveDefaultPageNumber}>
          Save
        </Button>
      </div>
    </div>
  )
}
