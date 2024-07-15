import React, { ReactNode, createContext, useContext, useState } from 'react'

import { fabric } from 'fabric'

import { EventContext } from '@/contexts/EventContext'
import { HistoryFeature } from '@/libs/fabric-history'
import { EventContextType } from '@/types/event-context.type'

type CanvasContextType = {
  canvas: fabric.Canvas | null
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>
  history: HistoryFeature | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveToStorage: (json: any) => void
}

export const CanvasContext = createContext<CanvasContextType | null>(null)

const useCanvasContext = () => useContext(CanvasContext)

export function CanvasContextProvider({ children }: { children: ReactNode }) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveToStorage = (json: any) => {
    if (!json || !currentFrame) return
    updateFrame({
      framePayload: {
        content: {
          canvas: JSON.stringify(json),
        },
      },
      frameId: currentFrame.id,
    })
  }

  // History feature
  const history = canvas ? new HistoryFeature(canvas) : undefined
  // history?.clearHistory?.()

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CanvasContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ canvas, setCanvas, history, saveToStorage }}>
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvas = () => {
  const context = useCanvasContext()
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider')
  }

  return context
}
