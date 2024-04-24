import { useCallback, useEffect, useRef } from 'react'

import { TDBinding, TDShape, TDUser, TldrawApp } from '@tldraw/tldraw'

import {
  doc,
  getProvider,
  undoManager,
  yBindings,
  yShapes,
} from '@/utils/tldraw'

export function useTldrawCollaboration(roomId: string) {
  const provider = getProvider({ roomId })
  const { awareness } = provider
  const tldrawRef = useRef<TldrawApp>()

  const onMount = useCallback(
    (app: TldrawApp) => {
      app.loadRoom(roomId)
      app.pause()
      tldrawRef.current = app

      app.replacePageContent(
        Object.fromEntries(yShapes.entries()),
        Object.fromEntries(yBindings.entries()),
        {}
      )
    },
    [roomId]
  )

  const onChangePage = useCallback(
    (
      app: TldrawApp,
      shapes: Record<string, TDShape | undefined>,
      bindings: Record<string, TDBinding | undefined>
    ) => {
      undoManager.stopCapturing()
      doc.transact(() => {
        Object.entries(shapes).forEach(([id, shape]) => {
          if (!shape) {
            yShapes.delete(id)
          } else {
            yShapes.set(shape.id, shape)
          }
        })
        Object.entries(bindings).forEach(([id, binding]) => {
          if (!binding) {
            yBindings.delete(id)
          } else {
            yBindings.set(binding.id, binding)
          }
        })
      })
    },
    []
  )

  const onUndo = useCallback(() => {
    undoManager.undo()
  }, [])

  const onRedo = useCallback(() => {
    undoManager.redo()
  }, [])

  /**
   * Callback to update user's (self) presence
   */
  const onChangePresence = useCallback((app: TldrawApp, user: TDUser) => {
    awareness.setLocalStateField('tdUser', user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Update app users whenever there is a change in the room users
   */
  useEffect(() => {
    const onChangeAwareness = () => {
      const tldraw = tldrawRef.current

      if (!tldraw || !tldraw.room) return

      const others = Array.from(awareness.getStates().entries())
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        .filter(([key, _]: any) => key !== awareness.clientID)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        .map(([_, state]: any) => state)
        .filter((user) => user.tdUser !== undefined)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ids = others.map((other: any) => other.tdUser.id as string)

      Object.values(tldraw.room.users).forEach((user) => {
        if (user && !ids.includes(user.id) && user.id !== tldraw.room?.userId) {
          tldraw.removeUser(user.id)
        }
      })

      tldraw.updateUsers(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        others.map((other: any) => other.tdUser).filter(Boolean)
      )
    }

    awareness.on('change', onChangeAwareness)

    return () => awareness.off('change', onChangeAwareness)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handleChanges() {
      const tldraw = tldrawRef.current

      if (!tldraw) return

      tldraw.replacePageContent(
        Object.fromEntries(yShapes.entries()),
        Object.fromEntries(yBindings.entries()),
        {}
      )
    }

    yShapes.observeDeep(handleChanges)

    return () => yShapes.unobserveDeep(handleChanges)
  }, [])

  useEffect(() => {
    function handleDisconnect() {
      provider.disconnect()
    }
    window.addEventListener('beforeunload', handleDisconnect)

    return () => window.removeEventListener('beforeunload', handleDisconnect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    onMount,
    onChangePage,
    onUndo,
    onRedo,
    onChangePresence,
  }
}
