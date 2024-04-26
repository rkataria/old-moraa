// eslint-disable-next-line import/no-extraneous-dependencies
import { TDBinding, TDShape } from '@tldraw/tldraw'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

export const doc = new Y.Doc()

const HOST_URL = `wss://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/realtime/v1/websocket`

export const getProvider = ({ roomId }: { roomId: string }) => {
  console.log('roomId', roomId)

  return new WebsocketProvider(HOST_URL, roomId, doc, {
    connect: true,
    resyncInterval: 1000,
    params: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      log_level: 'info',
      vsn: '1.0.0',
    },
  })
}

export const yShapes: Y.Map<TDShape> = doc.getMap('shapes')
export const yBindings: Y.Map<TDBinding> = doc.getMap('bindings')

export const undoManager = new Y.UndoManager([yShapes, yBindings])
