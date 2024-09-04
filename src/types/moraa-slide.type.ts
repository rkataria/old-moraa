import { Dispatch } from '@reduxjs/toolkit'

export type CanvasObjectAdded = {
  options: fabric.IEvent
  fabricRef: React.MutableRefObject<fabric.Canvas | null>
  frameId: string
  saveToStorage: (canvas: fabric.Canvas) => void
}

export type CanvasObjectModified = {
  options: fabric.IEvent
  canvas: fabric.Canvas
  dispatch: Dispatch
}

export type CanvasObjectRemoved = {
  options: fabric.IEvent
  canvas: fabric.Canvas
  dispatch: Dispatch
}

export type CanvasObjectMoving = {
  options: fabric.IEvent
  canvas: fabric.Canvas
  dispatch: Dispatch
}

export type CanvasObjectScaling = {
  options: fabric.IEvent
  canvas: fabric.Canvas
  dispatch: Dispatch
}

export type CanvasObjectRotating = {
  options: fabric.IEvent
  canvas: fabric.Canvas
  dispatch: Dispatch
}

export type CanvasObjectSkewing = {
  options: fabric.IEvent
  canvas: fabric.Canvas
  dispatch: Dispatch
}

export type CanvasSelectionCreated = {
  options: fabric.IEvent
  canvas: fabric.Canvas
  dispatch: Dispatch
}

export type CanvasSelectionUpdated = {
  options: fabric.IEvent
  canvas: fabric.Canvas
  dispatch: Dispatch
}

export type CanvasSelectionCleared = {
  options: fabric.IEvent
  dispatch: Dispatch
}
