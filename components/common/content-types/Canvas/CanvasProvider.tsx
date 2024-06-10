import { createContext, useContext, useState } from 'react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export type CanvasFrameContextType = {
  canvas: fabric.Canvas | null
  setCanvas: (canvas: fabric.Canvas | null) => void
  sync: () => void
}

export const CanvasFrameContext = createContext<CanvasFrameContextType>({
  canvas: null,
  setCanvas: () => {},
  sync: () => {},
})

export function CanvasFrameContextProvider({
  children,
}: React.PropsWithChildren<object>) {
  const { currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  const sync = () => {
    if (!canvas || !currentSlide) return

    const json = canvas.toJSON()

    updateSlide({
      slidePayload: {
        content: {
          canvas: JSON.stringify(json),
        },
      },
      slideId: currentSlide.id,
    })
  }

  return (
    <CanvasFrameContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        canvas,
        setCanvas,
        sync,
      }}>
      {children}
    </CanvasFrameContext.Provider>
  )
}
