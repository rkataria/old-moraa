/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Tldraw } from 'tldraw'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'tldraw/tldraw.css'

type MoraaBoardSlide = ISlide

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MoraaBoardEditor({ store }: { store: any }) {
  const [localSlide, setLocalSlide] = useState<MoraaBoardSlide | null>(null)
  const debouncedLocalSlide = useDebounce(localSlide, 500)
  const { currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType

  console.log('store', store)

  useEffect(() => {
    setLocalSlide(currentSlide)
  }, [currentSlide])

  useEffect(() => {
    if (!currentSlide?.content) {
      return
    }

    if (
      JSON.stringify(debouncedLocalSlide?.content) ===
      JSON.stringify(currentSlide.content)
    ) {
      return
    }

    updateSlide({
      slidePayload: {
        content: {
          ...currentSlide.content,
          ...debouncedLocalSlide?.content,
        },
      },
      slideId: currentSlide.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocalSlide?.content])

  if (!localSlide?.content) {
    return null
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden">
      <Tldraw key={localSlide.id} store={store} autoFocus />
    </div>
  )
}
