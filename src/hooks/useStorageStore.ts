/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from 'react'

import { useRoom } from '@liveblocks/react/suspense'
import {
  computed,
  createPresenceStateDerivation,
  createTLStore,
  react,
  defaultShapeUtils,
  DocumentRecordType,
  InstancePresenceRecordType,
  PageRecordType,
  IndexKey,
  TLAnyShapeUtilConstructor,
  TLDocument,
  TLInstancePresence,
  TLPageId,
  TLRecord,
  TLStoreEventInfo,
  TLStoreWithStatus,
  TLAssetStore,
  uniqueId,
} from 'tldraw'

import { uploadFile } from '@/services/storage.service'

const ASSET_KEY_FAILED_TO_UPLOAD = 'failed-to-upload'

export function useStorageStore({
  frameId,
  shapeUtils = [],
  user,
}: Partial<{
  frameId: string
  shapeUtils: TLAnyShapeUtilConstructor[]
  user: {
    id: string
    color: string
    name: string
  }
}>) {
  // Get Liveblocks room
  const room = useRoom()

  const hostedAssetStore: TLAssetStore = {
    async upload(asset, file) {
      const id = uniqueId()

      const objectName = `moraa-board-assets-${frameId}-${asset.id}-${id}`

      const response = (await uploadFile({
        fileName: objectName,
        file,
      }).promise) as { url: string }

      if (!response || !response.url) {
        throw new Error(ASSET_KEY_FAILED_TO_UPLOAD)
      }

      return response.url
    },

    resolve(asset) {
      return asset.props.src
    },
  }

  // Set up tldraw store and status
  const [store] = useState(() => {
    const store = createTLStore({
      id: frameId,
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
      assets: hostedAssetStore,
    })

    return store
  })

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: 'loading',
  })

  useEffect(() => {
    const unsubs: (() => void)[] = []
    setStoreWithStatus({ status: 'loading' })

    async function setup() {
      // Get Liveblocks Storage values
      const { root } = await room.getStorage()
      const liveRecords = root.get('records')

      // Initialize tldraw with records from Storage
      store.clear()
      store.put(
        [
          DocumentRecordType.create({
            id: 'document:document' as TLDocument['id'],
          }),
          PageRecordType.create({
            id: 'page:page' as TLPageId,
            name: 'Page 1',
            index: 'a1' as IndexKey,
          }),
          ...[...liveRecords.values()],
        ],
        'initialize'
      )

      // Sync tldraw changes with Storage
      unsubs.push(
        store.listen(
          ({ changes }: TLStoreEventInfo) => {
            // const failedToUploadAssets: string[] = []
            // console.log('store changes', changes)

            room.batch(() => {
              Object.values(changes.added).forEach((record) => {
                // console.log('store added', record)

                liveRecords.set(record.id, record)
              })

              Object.values(changes.updated).forEach(([_, record]) => {
                // console.log('store updated', record)

                // // Check if Image Asset has src value
                // if (
                //   record.typeName === 'asset' &&
                //   ['image'].includes(record.type) &&
                //   !record.props.src
                // ) {
                //   failedToUploadAssets.push(record.id)
                //   store.remove([record.id])

                //   return
                // }

                // // Remove shape for failed to upload assets
                // if (
                //   record.typeName === 'shape' &&
                //   failedToUploadAssets.includes(record.props.assetId as string)
                // ) {
                //   store.remove([record.id])

                //   return
                // }

                liveRecords.set(record.id, record)
              })

              Object.values(changes.removed).forEach((record) => {
                // console.log('store removed', record)
                liveRecords.delete(record.id)
              })
            })
          },
          { source: 'user', scope: 'document' }
        )
      )

      // Sync tldraw changes with Presence
      function syncStoreWithPresence({ changes }: TLStoreEventInfo) {
        room.batch(() => {
          Object.values(changes.added).forEach((record) => {
            room.updatePresence({ [record.id]: record })
          })

          Object.values(changes.updated).forEach(([_, record]) => {
            room.updatePresence({ [record.id]: record })
          })

          Object.values(changes.removed).forEach((record) => {
            room.updatePresence({ [record.id]: null })
          })
        })
      }

      unsubs.push(
        store.listen(syncStoreWithPresence, {
          source: 'user',
          scope: 'session',
        })
      )

      unsubs.push(
        store.listen(syncStoreWithPresence, {
          source: 'user',
          scope: 'presence',
        })
      )

      // Update tldraw when Storage changes
      unsubs.push(
        room.subscribe(
          liveRecords,
          (storageChanges) => {
            const toRemove: TLRecord['id'][] = []
            const toPut: TLRecord[] = []

            for (const update of storageChanges) {
              if (update.type !== 'LiveMap') {
                return
              }

              for (const [id, { type }] of Object.entries(update.updates)) {
                switch (type) {
                  // Object deleted from Liveblocks, remove from tldraw
                  case 'delete': {
                    toRemove.push(id as TLRecord['id'])
                    break
                  }

                  // Object updated on Liveblocks, update tldraw
                  case 'update': {
                    const curr = update.node.get(id)
                    if (curr) {
                      toPut.push(curr as any as TLRecord)
                    }
                    break
                  }
                }
              }
            }

            // Update tldraw with changes
            store.mergeRemoteChanges(() => {
              if (toRemove.length) {
                store.remove(toRemove)
              }
              if (toPut.length) {
                store.put(toPut)
              }
            })
          },
          { isDeep: true }
        )
      )

      // Set user's info
      const userPreferences = computed<{
        id: string
        color: string
        name: string
      }>('userPreferences', () => {
        if (!user) {
          throw new Error('Failed to get user')
        }

        return {
          id: user.id,
          color: user.color,
          name: user.name,
        }
      })

      // Unique ID for this session is their connectionId
      const connectionIdString = `${room.getSelf()?.connectionId || 0}`

      // Set both
      const presenceDerivation = createPresenceStateDerivation(
        userPreferences,
        InstancePresenceRecordType.createId(connectionIdString)
      )(store)

      // Update presence with tldraw values
      room.updatePresence({
        presence: presenceDerivation.get() ?? null,
      })

      // Update Liveblocks when tldraw presence changes
      unsubs.push(
        react('when presence changes', () => {
          const presence = presenceDerivation.get() ?? null
          requestAnimationFrame(() => {
            room.updatePresence({ presence })
          })
        })
      )

      // Sync Liveblocks presence with tldraw
      unsubs.push(
        room.subscribe('others', (others, event) => {
          const toRemove: TLInstancePresence['id'][] = []
          const toPut: TLInstancePresence[] = []

          switch (event.type) {
            // A user disconnected from Liveblocks
            case 'leave': {
              if (event.user.connectionId) {
                toRemove.push(
                  InstancePresenceRecordType.createId(
                    `${event.user.connectionId}`
                  )
                )
              }
              break
            }

            // Others was reset, e.g. after losing connection and returning
            case 'reset': {
              others.forEach((other) => {
                toRemove.push(
                  InstancePresenceRecordType.createId(`${other.connectionId}`)
                )
              })
              break
            }

            // A user entered or their presence updated
            case 'enter':
            case 'update': {
              const presence = event?.user?.presence
              if (presence?.presence) {
                toPut.push(event.user.presence.presence)
              }
            }
          }

          // Update tldraw with changes
          store.mergeRemoteChanges(() => {
            if (toRemove.length) {
              store.remove(toRemove)
            }
            if (toPut.length) {
              store.put(toPut)
            }
          })
        })
      )

      setStoreWithStatus({
        store,
        status: 'synced-remote',
        connectionStatus: 'online',
      })
    }

    setup()

    return () => {
      unsubs.forEach((fn) => fn())
      unsubs.length = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, store])

  return storeWithStatus
}
