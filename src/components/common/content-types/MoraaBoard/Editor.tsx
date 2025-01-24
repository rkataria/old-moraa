import { useCallback, useEffect, useRef } from 'react'

import {
  useOthers,
  useRoom,
  useSelf,
  useUpdateMyPresence,
} from '@liveblocks/react/suspense'
import {
  type Editor as TldrawEditor,
  Editor as IEditor,
  exportToBlob,
  PeopleMenu,
  Tldraw,
  TLShapeId,
} from 'tldraw'

import { ContentLoading } from '@/components/common/ContentLoading'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useProfile } from '@/hooks/useProfile'
import { useStorageStore } from '@/hooks/useStorageStore'
import { IFrame } from '@/types/frame.type'
import 'tldraw/tldraw.css'
import { blobToBase64WithMime } from '@/utils/base-64'

interface EditorProps {
  frame: IFrame
  readOnly?: boolean
  asThumbnail?: boolean
}

export function Editor({
  frame,
  readOnly = false,
  asThumbnail = false,
}: EditorProps) {
  const isReadonly = readOnly || asThumbnail
  const { data: userProfile } = useProfile()
  const editorRef = useRef<TldrawEditor | null>(null)
  const { permissions } = useEventPermissions()
  const id = useSelf((me) => me.id)
  const info = useSelf((me) => me.info)
  const updateMyPresence = useUpdateMyPresence()
  updateMyPresence({ isHost: permissions.canUpdateFrame })
  const hostPresence = useOthers((others) =>
    others.find((other) => other.presence.isHost)
  )
  const room = useRoom()

  const store = useStorageStore({
    frameId: frame.id,
    user: { id, color: info?.color, name: info?.name },
  })

  useEffect(() => {
    if (!hostPresence) return
    if (userProfile?.email !== import.meta.env.VITE_RECORDER_BOT_EMAIL) return
    editorRef.current?.startFollowingUser(hostPresence.id)
  }, [hostPresence, userProfile])

  const saveCurrentEditorThumbnail = useCallback(
    (editor: IEditor, shapes: Set<TLShapeId>) => {
      if (!editor || !shapes?.size || isReadonly) return
      exportToBlob({
        editor,
        ids: [...shapes],
        format: 'svg',
        opts: { background: false, padding: 10 },
      }).then((blob) => {
        blobToBase64WithMime(blob, 'image/svg+xml').then((base64URL) => {
          room.getStorage().then((storage) => {
            storage.root.update({
              thumbnail: base64URL,
            })
          })
        })
      })
    },
    [isReadonly, room]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const editor = editorRef.current
      const shapeIds = editor?.getCurrentPageShapeIds()
      if (!editor || !shapeIds?.size) return

      saveCurrentEditorThumbnail(editor, shapeIds)
    }, 7000)

    return () => {
      clearInterval(interval)
    }
  }, [room, saveCurrentEditorThumbnail])

  if (store.status !== 'synced-remote') return <ContentLoading />

  return (
    <Tldraw
      autoFocus
      store={store}
      className="z-[1] relative w-full h-full border border-gray-200 bg-[#FEFEFE] rounded-md"
      components={{
        SharePanel: PeopleMenu,
        DebugPanel: null,
      }}
      hideUi={isReadonly}
      onMount={(editor) => {
        editorRef.current = editor
        saveCurrentEditorThumbnail(editor, editor?.getCurrentPageShapeIds())
        editor.updateInstanceState({
          isReadonly: !!isReadonly,
        })
        editor.zoomOut(editor.getViewportScreenCenter())
      }}
    />
  )
}
