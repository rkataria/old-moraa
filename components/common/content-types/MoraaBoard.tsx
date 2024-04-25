'use client'

import { useContext, useEffect, useState } from 'react'

import { Tldraw, useFileSystem } from '@tldraw/tldraw'
import { useThrottle } from '@uidotdev/usehooks'
import { useParams } from 'next/navigation'
import { useUsers } from 'y-presence'

import { EventContext } from '@/contexts/EventContext'
import { useTldrawCollaboration } from '@/hooks/useTldrawCollaboration'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'
import { getProvider } from '@/utils/tldraw'

export type MoraaBoardSlide = ISlide & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlide
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const { eventId } = useParams()
  const fileSystemEvents = useFileSystem()
  const roomId = `moraa-board-${slide.id}-${eventId}`
  const { awareness } = getProvider({ roomId })
  const [localSlide, setLocalSlide] = useState<MoraaBoardSlide | null>(null)
  const throttledSlide = useThrottle(localSlide, 500)
  const { preview, isOwner, currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType
  const { onMount, ...events } = useTldrawCollaboration(roomId)

  useEffect(() => {
    if (!currentSlide) {
      return
    }

    setLocalSlide(currentSlide as MoraaBoardSlide)
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
  const readOnly = preview || (!isOwner && currentSlide?.config?.allowToDraw)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="relative w-full h-full flex flex-col justify-center items-center px-4">
      <Users awareness={awareness} />
      <Tldraw
        readOnly={readOnly}
        showMultiplayerMenu={false}
        showSponsorLink={false}
        showMenu={false}
        autofocus
        disableAssets
        document={storedDocument}
        showPages={false}
        onMount={onMount}
        {...fileSystemEvents}
        {...events}
        onChange={(state) => {
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
export function Users({ awareness }: { awareness: any }) {
  const users = useUsers(awareness)

  return (
    <div className="absolute top-0 left-0 w-full p-md z-[1]">
      <div className="flex space-between">
        <span>Users: {users.size}</span>
      </div>
    </div>
  )
}
