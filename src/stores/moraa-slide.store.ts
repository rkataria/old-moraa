// eslint-disable-next-line import/no-extraneous-dependencies
import { create } from 'zustand'

import { HistoryFeature } from '@/libs/fabric-history'

interface MoraaSlideState {
  canvasInstances: {
    [key: string]: fabric.Canvas | null
  }
  history: {
    [key: string]: HistoryFeature | null
  }
  templateKey: string | null
  activeObject: fabric.Object | null
  setTemplateKey: (templateKey: string | null) => void
  setCanvas: (frameId: string, canvas: fabric.Canvas) => void
  setHistory: (frameId: string, history: HistoryFeature) => void
  getCanvasObjects: (frameId: string) => fabric.Object[]
  setActiveObject: (object: fabric.Object | null) => void
  reset: () => void
}

const initialState = {
  canvasInstances: {},
  history: {},
  templateKey: null,
  activeObject: null,
}

export const useMoraaSlideStore = create<MoraaSlideState>((set, get) => ({
  ...initialState,
  setTemplateKey: (templateKey: string | null) => set({ templateKey }),
  setCanvas: (frameId: string, canvas: fabric.Canvas) =>
    set({ canvasInstances: { ...get().canvasInstances, [frameId]: canvas } }),
  setHistory: (frameId: string, history: HistoryFeature) =>
    set({
      history: { ...get().history, [frameId]: history },
    }),
  getCanvasObjects: (frameId: string) => {
    const state = get()

    return state.canvasInstances[frameId]?.getObjects() || []
  },
  setActiveObject: (object: fabric.Object | null) => {
    set({ activeObject: object })
  },
  reset: () => {
    set(initialState)
  },
}))
