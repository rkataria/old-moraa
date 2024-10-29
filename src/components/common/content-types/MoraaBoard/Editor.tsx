import { useSelf } from '@liveblocks/react/suspense'
import { Tldraw } from 'tldraw'

import { NameEditor } from './NameEditor'

import { ContentLoading } from '@/components/common/ContentLoading'
import { useStorageStore } from '@/hooks/useStorageStore'
import 'tldraw/tldraw.css'

interface EditorProps {
  readOnly?: boolean
}

export function Editor({ readOnly = false }: EditorProps) {
  const id = useSelf((me) => me.id)
  const info = useSelf((me) => me.info)
  const store = useStorageStore({
    user: { id, color: info?.color, name: info?.name },
  })

  if (store.status !== 'synced-remote') return <ContentLoading />

  return (
    <Tldraw
      autoFocus
      store={store}
      components={{
        SharePanel: readOnly ? null : NameEditor,
      }}
      hideUi={readOnly}
      onMount={(editor) => {
        editor.updateInstanceState({ isReadonly: !!readOnly })
      }}
    />
  )
}
