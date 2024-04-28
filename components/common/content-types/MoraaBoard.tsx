'use client'

import { useContext } from 'react'

import { Tldraw, track, useEditor } from 'tldraw'

import { ContentLoading } from '../ContentLoading'

import { EventContext } from '@/contexts/EventContext'
import { useYjsStoreSupabase } from '@/hooks/useYjsStoreSupabase'
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

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const { preview, isOwner } = useContext(EventContext) as EventContextType
  const roomId = `present-moraa-board-${slide.id}`
  const store = useYjsStoreSupabase({
    roomId,
    slideId: slide.id,
  })

  const readOnly = preview || (!isOwner && slide.config?.allowToDraw)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="relative w-full h-full flex flex-col justify-center items-center px-4 z-[0]">
      {store.status === 'loading' && (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <ContentLoading />
        </div>
      )}
      <Tldraw
        // persistenceKey={roomId}
        autoFocus
        store={store}
        components={{
          SharePanel: NameEditor,
        }}
        onMount={(editor) => {
          editor.updateInstanceState({ isReadonly: !!readOnly })
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
