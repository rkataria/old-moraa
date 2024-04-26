'use client'

import { useContext, useEffect, useState } from 'react'

import { Tldraw, useFileSystem } from '@tldraw/tldraw'
import { useDebounce } from '@uidotdev/usehooks'
import { useUsers } from 'y-presence'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'
import { awareness } from '@/utils/tldraw-yjs'

export type MoraaBoardSlide = ISlide & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlide
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const [localSlide, setLocalSlide] = useState<MoraaBoardSlide | null>(null)
  const debouncedLocalSlide = useDebounce(localSlide, 500)
  const { isOwner, preview, currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType
  const fileSystemEvents = useFileSystem()

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

  const storedDocument = JSON.parse(localSlide.content.document as string)
  const readOnly = preview || (!isOwner && localSlide.config?.allowToDraw)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="relative w-full h-full flex flex-col justify-center items-center px-4">
      <Users />
      <Tldraw
        readOnly={readOnly}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Users() {
  const users = useUsers(awareness)

  return (
    <div className="absolute top-0 left-0 w-full p-md z-[1]">
      <div className="flex space-between">
        <span>Users: {users.size}</span>
      </div>
    </div>
  )
}
