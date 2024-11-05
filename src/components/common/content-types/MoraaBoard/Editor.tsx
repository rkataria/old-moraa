import { useSelf } from '@liveblocks/react/suspense'
import { Tldraw } from 'tldraw'

import { NameEditor } from './NameEditor'

import { ContentLoading } from '@/components/common/ContentLoading'
import { useStorageStore } from '@/hooks/useStorageStore'
import { IFrame } from '@/types/frame.type'

import 'tldraw/tldraw.css'

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
  const id = useSelf((me) => me.id)
  const info = useSelf((me) => me.info)
  const store = useStorageStore({
    frameId: frame.id,
    user: { id, color: info?.color, name: info?.name },
  })

  if (store.status !== 'synced-remote') return <ContentLoading />

  const isReadonly = readOnly || asThumbnail

  return (
    <Tldraw
      autoFocus
      store={store}
      components={{
        SharePanel: NameEditor,
        DebugPanel: null,
      }}
      // persistenceKey={frame.id}
      hideUi={isReadonly}
      onMount={(editor) => {
        editor.updateInstanceState({ isReadonly: !!isReadonly })
        editor.zoomOut(editor.getViewportScreenCenter())
      }}
    />
  )
}
