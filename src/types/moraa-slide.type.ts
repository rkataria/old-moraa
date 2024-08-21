export type CanvasObjectAdded = {
  options: fabric.IEvent
  fabricRef: React.MutableRefObject<fabric.Canvas | null>
  frameId: string
}

export type CanvasObjectModified = {
  options: fabric.IEvent
}

export type CanvasObjectRemoved = {
  options: fabric.IEvent
}

export type CanvasObjectMoving = {
  options: fabric.IEvent
}

export type CanvasObjectScaling = {
  options: fabric.IEvent
}

export type CanvasObjectRotating = {
  options: fabric.IEvent
}

export type CanvasObjectSkewing = {
  options: fabric.IEvent
}

export type CanvasSelectionCreated = {
  options: fabric.IEvent
  canvas: fabric.Canvas
}

export type CanvasSelectionUpdated = {
  options: fabric.IEvent
  canvas: fabric.Canvas
}

export type CanvasSelectionCleared = {
  options: fabric.IEvent
}
