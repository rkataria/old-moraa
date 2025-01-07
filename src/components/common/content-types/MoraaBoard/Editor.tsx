import { useSelf } from '@liveblocks/react/suspense'
import { PeopleMenu, Tldraw, TLTextShapeProps } from 'tldraw'

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
      className="z-[1] relative w-full h-full"
      components={{
        SharePanel: PeopleMenu,
        DebugPanel: null,
      }}
      hideUi={isReadonly}
      onMount={(editor) => {
        editor.updateInstanceState({ isReadonly: !!isReadonly })
        editor.zoomOut(editor.getViewportScreenCenter())
        const shapes = editor.getCurrentPageShapes()
        editor.updateShapes(
          shapes.map((shape) => {
            const currentWidth = (shape.props as TLTextShapeProps).w
            const widthStr = currentWidth.toString()
            const decimalPart = widthStr.split('.')[1]
            const lastDecimalDigit = parseInt(decimalPart.slice(-1), 10)
            const decimalPlaces = decimalPart.length
            const adjustment = 1 / 10 ** decimalPlaces
            const newWidth =
              lastDecimalDigit % 2 === 0
                ? currentWidth + adjustment
                : currentWidth - adjustment

            return {
              ...shape,
              props: {
                ...shape.props,
                w: parseFloat(newWidth.toFixed(decimalPlaces)),
              },
            }
          })
        )
      }}
    />
  )
}
