/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client'

import React, { useContext, useEffect, useState } from 'react'

import { Tldraw, useFileSystem } from '@tldraw/tldraw'
import { useThrottle } from '@uidotdev/usehooks'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

type MoraaBoardSlide = ISlide

export function MoraaBoardEditor() {
  const [localSlide, setLocalSlide] = useState<MoraaBoardSlide | null>(null)
  const throttledSlide = useThrottle(localSlide, 500)
  const { currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType
  const fileSystemEvents = useFileSystem()

  useEffect(() => {
    setLocalSlide(currentSlide)
  }, [currentSlide])

  useEffect(() => {
    if (!currentSlide?.content) {
      return
    }

    if (!throttledSlide?.content) {
      return
    }

    if (
      JSON.stringify(throttledSlide?.content) ===
      JSON.stringify(currentSlide.content)
    ) {
      return
    }

    updateSlide({
      slidePayload: {
        content: {
          ...currentSlide.content,
          ...throttledSlide?.content,
        },
      },
      slideId: currentSlide.id,
      allowNonOwnerToUpdate: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledSlide?.content])

  if (!localSlide?.content) {
    return null
  }

  const storedDocument = JSON.parse(localSlide.content.document as string)

  return (
    <div className="w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden">
      <Tldraw
        showMultiplayerMenu={false}
        showSponsorLink={false}
        showMenu={false}
        autofocus
        disableAssets
        document={storedDocument}
        {...fileSystemEvents}
        onChange={(state) => {
          if (
            JSON.stringify(state.document) === JSON.stringify(storedDocument)
          ) {
            return
          }

          setLocalSlide(
            (prev) =>
              ({
                ...prev,
                content: {
                  document: JSON.stringify(state.document),
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any
          )
        }}
      />
    </div>
  )
}
