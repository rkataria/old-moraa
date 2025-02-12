import { useCallback, useEffect, useMemo, useRef } from 'react'

import {
  useOthers,
  useRoom,
  useSelf,
  useUpdateMyPresence,
} from '@liveblocks/react/suspense'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  type Editor as TldrawEditor,
  Editor as IEditor,
  exportToBlob,
  Tldraw,
  DefaultMainMenu,
  DefaultPageMenu,
} from 'tldraw'

import { RenderIf } from '../../RenderIf/RenderIf'

import { ContentLoading } from '@/components/common/ContentLoading'
import { SharePanel } from '@/components/moraa-board/SharePanel'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useProfile } from '@/hooks/useProfile'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useStorageStore } from '@/hooks/useStorageStore'
import { setCurrentFrameStateAction } from '@/stores/slices/layout/studio.slice'
import { IFrame } from '@/types/frame.type'
import 'tldraw/tldraw.css'
import { blobToBase64WithMime } from '@/utils/base-64'
import { cn } from '@/utils/utils'

interface EditorProps {
  frame: IFrame
  readOnly?: boolean
  asThumbnail?: boolean
}

const components = ({
  startFollowingUser,
  stopFollowingUser,
  isHost,
  frameId,
}: {
  startFollowingUser?: TldrawEditor['startFollowingUser']
  stopFollowingUser?: TldrawEditor['stopFollowingUser']
  isHost: boolean
  frameId: string
}) => ({
  SharePanel: () => (
    <SharePanel
      onStartFollowing={startFollowingUser}
      onStopFollowing={stopFollowingUser}
      frameId={frameId}
    />
  ),
  MainMenu: isHost ? DefaultMainMenu : null,
  PageMenu: isHost ? DefaultPageMenu : null,
})

export function Editor({
  frame,
  readOnly = false,
  asThumbnail = false,
}: EditorProps) {
  const currentFrameStates = useStoreSelector(
    (store) => store.layout.studio.currentFrameStates
  )
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
  const dispatch = useStoreDispatch()

  useHotkeys(
    'Esc',
    () => {
      dispatch(
        setCurrentFrameStateAction({
          ...currentFrameStates,
          isFullscreen: false,
        })
      )
    },
    [currentFrameStates?.isFullscreen]
  )

  useEffect(() => {
    if (!hostPresence) return
    if (userProfile?.email !== import.meta.env.VITE_RECORDER_BOT_EMAIL) return
    editorRef.current?.startFollowingUser(hostPresence.id)
  }, [hostPresence, userProfile])

  const saveCurrentEditorThumbnail = useCallback(
    (editor: IEditor) => {
      if (!editor || isReadonly) return
      const shapes = editor?.getCurrentPageShapeIds()
      if (!shapes?.size) {
        room.getStorage().then((storage) => {
          storage.root.update({
            thumbnail: '',
          })
        })

        return
      }
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

  const memoizedComponents = useMemo(
    () =>
      components({
        startFollowingUser: editorRef.current?.startFollowingUser,
        stopFollowingUser: editorRef.current?.stopFollowingUser,
        isHost: permissions.canUpdateFrame,
        frameId: frame.id,
      }),
    [permissions.canUpdateFrame, frame.id]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const editor = editorRef.current
      if (!editor) return

      saveCurrentEditorThumbnail(editor)
    }, 7000)

    return () => {
      clearInterval(interval)
    }
  }, [room, saveCurrentEditorThumbnail])

  if (store.status !== 'synced-remote') return <ContentLoading />

  return (
    <div
      className={cn('relative w-full h-full', {
        'fixed left-0 top-0 w-full h-full z-[99]':
          !asThumbnail && currentFrameStates?.isFullscreen,
      })}>
      <Tldraw
        autoFocus
        store={store}
        className="z-[1] relative w-full h-full border border-gray-200 bg-[#FEFEFE] rounded-md"
        components={memoizedComponents}
        onMount={(editor) => {
          editorRef.current = editor
          saveCurrentEditorThumbnail(editor)
          editor.updateInstanceState({
            isReadonly: !!isReadonly,
          })
          editor.zoomOut(editor.getViewportScreenCenter())
        }}>
        {/* <RenderIf isTrue={!isReadonly}>
          <VerticalToolbar />
        </RenderIf> */}
      </Tldraw>

      <RenderIf isTrue={isReadonly}>
        <div className="absolute right-0 top-0 z-1">
          <SharePanel
            onStartFollowing={editorRef.current?.startFollowingUser}
            onStopFollowing={editorRef.current?.stopFollowingUser}
            frameId={frame.id}
          />
        </div>
      </RenderIf>
    </div>
  )
}
