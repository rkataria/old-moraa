/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */
import React, {
  createContext,
  PropsWithChildren,
  useRef,
  useState,
} from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MoraaSlideEditorContext = createContext<{
  canvas: fabric.Canvas | null
  copiedObjectRef: React.MutableRefObject<fabric.Object | null>
  setCanvas: (canvas: fabric.Canvas) => void
}>({
  canvas: null,
  copiedObjectRef: { current: null },
  setCanvas: () => {},
})

export function MoraaSlideEditorContextProvider({
  children,
}: PropsWithChildren) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const copiedObjectRef = useRef<fabric.Object | null>(null)

  return (
    <MoraaSlideEditorContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        canvas,
        copiedObjectRef,
        setCanvas,
      }}>
      {children}
    </MoraaSlideEditorContext.Provider>
  )
}

export const useMoraaSlideEditorContext = () => {
  const context = React.useContext(MoraaSlideEditorContext)

  if (!context) {
    throw new Error(
      'useMoraaSlideEditorContext must be used within a MoraaSlideEditorContextProvider'
    )
  }

  return context
}
