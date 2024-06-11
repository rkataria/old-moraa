'use client'

import { useContext, useEffect } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { useDebounce } from '@uidotdev/usehooks'
import { Tldraw, track, useEditor } from 'tldraw'

import { ContentLoading } from '../ContentLoading'

import { EventContext } from '@/contexts/EventContext'
import { useYjsStoreSupabase } from '@/hooks/useYjsStoreSupabase'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

import 'tldraw/tldraw.css'

export type MoraaBoardFrame = IFrame & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  frame: MoraaBoardFrame
}

export function MoraaBoard({ frame }: MoraaBoardProps) {
  const { preview, isOwner } = useContext(EventContext) as EventContextType
  const roomId = `present-moraa-board-${frame.id}`
  const store = useYjsStoreSupabase({
    roomId,
    frameId: frame.id,
  })
  const debouncedStatus = useDebounce(store.status, 2000)

  const readOnly = preview || (!isOwner && frame.config?.allowToDraw)

  return (
    <div
      style={{ backgroundColor: frame.config.backgroundColor }}
      className="relative w-full flex-auto flex flex-col justify-center items-center px-4 z-[0] h-full">
      {debouncedStatus !== 'synced-remote' ? (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <ContentLoading />
        </div>
      ) : (
        <Tldraw
          // persistenceKey={roomId}
          autoFocus
          store={store}
          components={{
            SharePanel: preview ? null : NameEditor,
          }}
          onMount={(editor) => {
            editor.updateInstanceState({ isReadonly: !!readOnly })
          }}
        />
      )}
    </div>
  )
}

const NameEditor = track(() => {
  const editor = useEditor()
  const name = useDyteSelector((s) => s.self.name)

  useEffect(() => {
    editor.user.updateUserPreferences({
      name,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  const { color } = editor.user.getUserPreferences()

  return (
    <div className="flex justify-end items-center gap-1 pointer-events-auto">
      <input
        type="color"
        className="w-12 cursor-pointer"
        value={color}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            color: e.currentTarget.value,
          })
        }}
      />
      <span>{name}</span>
    </div>
  )
})
