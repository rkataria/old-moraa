'use client'

import { useContext, useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import { Tldraw, track, useEditor } from 'tldraw'

import { EventContext } from '@/contexts/EventContext'
import { useYjsStore } from '@/hooks/useYjsStore'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'
import 'tldraw/tldraw.css'

export type MoraaBoardSlide = ISlide & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlide
}

// const HOST_URL =
//   import.meta.env.MODE === 'development'
//     ? 'ws://localhost:1234'
//     : 'wss://demos.yjs.dev'

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const [localSlide, setLocalSlide] = useState<MoraaBoardSlide | null>(null)
  const debouncedLocalSlide = useDebounce(localSlide, 500)
  const { isOwner, currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType
  const store = useYjsStore({
    roomId: 'example17',
    hostUrl: 'ws://localhost:1234',
  })

  useEffect(() => {
    setLocalSlide(currentSlide as MoraaBoardSlide)
  }, [currentSlide])

  useEffect(() => {
    if (!currentSlide?.content) {
      return
    }

    if (!debouncedLocalSlide?.content) {
      return
    }

    if (
      JSON.stringify(debouncedLocalSlide?.content) ===
      JSON.stringify(currentSlide.content)
    ) {
      return
    }

    if (!isOwner && !currentSlide.config.allowToDraw) return

    updateSlide({
      slidePayload: {
        content: {
          ...currentSlide.content,
          ...debouncedLocalSlide?.content,
        },
      },
      slideId: currentSlide.id,
      allowNonOwnerToUpdate: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocalSlide?.content])

  if (!localSlide?.content) {
    return null
  }

  // const storedDocument = JSON.parse(localSlide.content.document as string)
  // const readOnly = preview || (!isOwner && localSlide.config?.allowToDraw)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="relative w-full h-full flex flex-col justify-center items-center px-4">
      <Tldraw
        autoFocus
        store={store}
        components={{
          SharePanel: NameEditor,
        }}
      />
    </div>
  )
}

const NameEditor = track(() => {
  const editor = useEditor()

  const { color, name } = editor.user.getUserPreferences()

  return (
    <div style={{ pointerEvents: 'all', display: 'flex' }}>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            color: e.currentTarget.value,
          })
        }}
      />
      <input
        value={name}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            name: e.currentTarget.value,
          })
        }}
      />
    </div>
  )
})
