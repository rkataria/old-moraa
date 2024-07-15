'use client'

import { useContext, useEffect } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { Tldraw, track, useEditor } from 'tldraw'

import { ContentLoading } from '../ContentLoading'

import { EventContext } from '@/contexts/EventContext'
import { useYjsStore } from '@/hooks/useYjsStore'
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
  isInteractive?: boolean
}

export function MoraaBoard({ frame, isInteractive = true }: MoraaBoardProps) {
  const { preview, eventMode } = useContext(EventContext) as EventContextType
  const store = useYjsStore({
    roomId: frame.id,
    hostUrl: process.env.NEXT_PUBLIC_PARTYKIT_HOST_URL,
  })

  const readOnly =
    preview ||
    (!isInteractive && !!frame.config?.allowToDraw) ||
    (!isInteractive && eventMode !== 'present')

  return (
    <div
      style={{ backgroundColor: frame.config.backgroundColor }}
      className="relative w-full flex-auto flex flex-col justify-center items-center px-4 z-[0] h-full">
      {store.status !== 'synced-remote' ? (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <ContentLoading />
        </div>
      ) : (
        <Tldraw
          // persistenceKey={roomId}
          autoFocus
          store={store}
          components={{
            SharePanel: readOnly ? null : NameEditor,
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
