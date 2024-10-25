import { useContext, useEffect } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { useSelf } from '@liveblocks/react/suspense'
import { ErrorBoundary } from '@sentry/react'
import { Tldraw, track, useEditor } from 'tldraw'

import { ContentLoading } from '../ContentLoading'

import { EventContext } from '@/contexts/EventContext'
import { useStorageStore } from '@/hooks/useStorageStore'
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
  const id = useSelf((me) => me.id)
  const info = useSelf((me) => me.info)
  const store = useStorageStore({
    user: { id, color: info?.color, name: info?.name },
  })

  const readOnly =
    preview ||
    (!isInteractive && !!frame.config?.allowToDraw) ||
    (!isInteractive && eventMode !== 'present')

  return (
    <div className="relative w-full flex-auto flex flex-col justify-center items-center z-[0] h-full bg-white rounded-md overflow-hidden">
      {store.status !== 'synced-remote' ? (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <ContentLoading />
        </div>
      ) : (
        <ErrorBoundary>
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
        </ErrorBoundary>
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
    <div className="flex justify-end items-center gap-1 pointer-events-auto h-10 px-2 bg-[var(--color-low)] rounded-bl-[11px]">
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
