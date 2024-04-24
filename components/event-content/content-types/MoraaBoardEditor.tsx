/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client'

import React, { useContext, useEffect, useState } from 'react'

import { Tldraw, useFileSystem, TDBinding, TDShape } from '@tldraw/tldraw'
import { useDebounce } from '@uidotdev/usehooks'
import { useParams } from 'next/navigation'
import { useUsers } from 'y-presence'
// eslint-disable-next-line import/no-extraneous-dependencies
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import { EventContext } from '@/contexts/EventContext'
import { useTldrawCollaboration } from '@/hooks/useTldrawCollaboration'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

export const doc = new Y.Doc()

const HOST_URL = `wss://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/realtime/v1/websocket`

export const getProvider = ({ roomId }: { roomId: string }) =>
  new WebsocketProvider(HOST_URL, roomId, doc, {
    connect: true,
    params: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      log_level: 'info',
      vsn: '1.0.0',
    },
  })

export const yShapes: Y.Map<TDShape> = doc.getMap('shapes')
export const yBindings: Y.Map<TDBinding> = doc.getMap('bindings')

export const undoManager = new Y.UndoManager([yShapes, yBindings])

type MoraaBoardSlide = ISlide

export function MoraaBoardEditor() {
  const { eventId } = useParams()
  const [localSlide, setLocalSlide] = useState<MoraaBoardSlide | null>(null)
  const debouncedLocalSlide = useDebounce(localSlide, 500)
  const { currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType
  const fileSystemEvents = useFileSystem()
  const roomId = `moraa-board-${currentSlide?.id}-${eventId}`
  const { awareness } = getProvider({ roomId })
  const { onMount, ...events } = useTldrawCollaboration(roomId)

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
      <Users awareness={awareness} />
      <Tldraw
        autofocus
        disableAssets
        showPages={false}
        onMount={onMount}
        {...fileSystemEvents}
        {...events}
      />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Users({ awareness }: { awareness: any }) {
  const users = useUsers(awareness)

  return (
    <div className="absolute top-0 left-0 w-full p-md">
      <div className="flex space-between">
        <span>Number of connected users: {users.size}</span>
      </div>
    </div>
  )
}
