import React, { useContext, useEffect, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { ContentType } from '../common/ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PDFSlideSettings() {
  const { updateSlide, currentSlide } = useContext(
    EventContext
  ) as EventContextType
  const [defaultPage, setDefaultPage] = useState<null | number>(
    (currentSlide?.content?.defaultPage as number) || 1
  )

  useEffect(() => {
    if (!Number.isNaN(currentSlide?.content?.defaultPage)) {
      setDefaultPage(currentSlide?.content?.defaultPage as number)
    }
  }, [currentSlide?.content?.defaultPage])

  if (!currentSlide || currentSlide.type !== ContentType.PDF_VIEWER) return null

  const saveDefaultPageNumber = () => {
    updateSlide({
      slidePayload: {
        content: {
          ...currentSlide.content,
          defaultPage,
        },
      },
      slideId: currentSlide.id,
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
