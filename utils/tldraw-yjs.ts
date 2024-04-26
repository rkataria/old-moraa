import { TDBinding, TDShape } from '@tldraw/tldraw'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

const VERSION = 1

// Create the doc
export const doc = new Y.Doc()

export const roomID = `y-tldraw-${VERSION}`

// Create a websocket provider
export const provider = new WebsocketProvider(
  'wss://demos.yjs.dev',
  roomID,
  doc,
  {
    connect: true,
  }
)

// Export the provider's awareness API
export const { awareness } = provider

export const yShapes: Y.Map<TDShape> = doc.getMap('shapes')
export const yBindings: Y.Map<TDBinding> = doc.getMap('bindings')

// Create an undo manager for the shapes and binding maps
export const undoManager = new Y.UndoManager([yShapes, yBindings])
