/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
// @ts-nocheck

'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'

import { ISlide } from '@/types/slide.type'
import 'tldraw/tldraw.css'

import { EventContextType } from '@/types/event-context.type'
import { EventContext } from '@/contexts/EventContext'
/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  InstancePresenceRecordType,
  TLInstancePresence,
  TLRecord,
  Tldraw,
  computed,
  createPresenceStateDerivation,
  createTLStore,
  defaultShapeUtils,
  defaultUserPreferences,
  getUserPreferences,
  react,
  setUserPreferences,
} from 'tldraw'
import { YKeyValue } from 'y-utility/y-keyvalue'
import * as Y from 'yjs'

import { ContentLoading } from '@/components/common/ContentLoading'
import { supabaseClient } from '@/utils/supabase/client'
import { SupabaseProvider } from '@/utils/y-supabase'

export type MoraaBoardSlide = ISlide & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlide
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const { preview, isOwner } = useContext(EventContext) as EventContextType
  const roomId = `present-moraa-board-${slide.id}`
  const stateRef = useRef<any>({})

  useLayoutEffect(() => {
    stateRef.current.tlStore = createTLStore({
      shapeUtils: defaultShapeUtils,
    })

    stateRef.current.yDocInstance = new Y.Doc({ gc: true })
    const yArr = stateRef.current.yDocInstance.getArray(`tl_${slide.id}`)
    stateRef.current.yStore = new YKeyValue(yArr)
    stateRef.current.meta = stateRef.current.yDocInstance.getMap('meta')

    stateRef.current.supabaseProviderInstance = new SupabaseProvider(
      stateRef.current.yDocInstance,
      supabaseClient,
      {
        channel: roomId,
        id: slide.id,
        tableName: 'slide',
        columnName: 'content',
        resyncInterval: 1000 * 30,
      }
    )

    function handleSync() {
      stateRef.current.tlStore.listen(
        ({ changes }: any) => {
          console.log('🚀 ~ handleSync > tlStore > changes:', changes)
          stateRef.current.yDocInstance.transact(() => {
            Object.values(changes.added).forEach((record: any) => {
              stateRef.current.yStore.set(record.id, record)
            })

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.values(changes.updated).forEach(([_, record]: any) => {
              stateRef.current.yStore.set(record.id, record)
            })

            Object.values(changes.removed).forEach((record: any) => {
              stateRef.current.yStore.delete(record.id)
            })
          })
        },
        { source: 'user', scope: 'document' } // only sync user's document changes
      )
      const handleChange = (
        changes: Map<
          string,
          | { action: 'delete'; oldValue: TLRecord }
          | { action: 'update'; oldValue: TLRecord; newValue: TLRecord }
          | { action: 'add'; newValue: TLRecord }
        >,
        transaction: Y.Transaction
      ) => {
        console.log(
          '🚀 ~ handleSync > yStore > handleChange ~ changes:',
          changes
        )
        if (transaction.local) return

        const toRemove: TLRecord['id'][] = []
        const toPut: TLRecord[] = []

        changes.forEach((change, id) => {
          switch (change.action) {
            case 'add':
            case 'update': {
              const record = stateRef.current.yStore.get(id)!
              toPut.push(record)
              break
            }
            case 'delete': {
              toRemove.push(id as TLRecord['id'])
              break
            }
          }
        })

        // put / remove the records in the store
        stateRef.current.tlStore.mergeRemoteChanges(() => {
          if (toRemove.length) stateRef.current.tlStore.remove(toRemove)
          if (toPut.length) stateRef.current.tlStore.put(toPut)
        })
      }
      stateRef.current.yStore.on('change', handleChange)

      const yClientId =
        stateRef.current.supabaseProviderInstance?.awareness.clientID.toString()
      if (yClientId) {
        setUserPreferences({ id: yClientId })
      }

      const userPreferences = computed<{
        id: string
        color: string
        name: string
      }>('userPreferences', () => {
        const user = getUserPreferences()
        console.log('🚀 ~ handleSync ~ user:', user)

        return {
          id: user.id,
          color: user.color ?? defaultUserPreferences.color,
          name: user.name ?? defaultUserPreferences.name,
        }
      })

      // Create the instance presence derivation
      const presenceId = InstancePresenceRecordType.createId(yClientId)
      const presenceDerivation = createPresenceStateDerivation(
        userPreferences,
        presenceId
      )(stateRef.current.yStore)

      // Set our initial presence from the derivation's current value
      stateRef.current.supabaseProviderInstance?.awareness.setLocalStateField(
        'presence',
        presenceDerivation.get()
      )

      // When the derivation change, sync presence to to yjs awareness
      react('when presence changes', () => {
        const presence = presenceDerivation.get()
        requestAnimationFrame(() => {
          stateRef.current.supabaseProviderInstance?.awareness.setLocalStateField(
            'presence',
            presence
          )
        })
      })
      // unsubs.push(
      // )

      // Sync yjs awareness changes to the store
      const handleUpdate = (update: {
        added: number[]
        updated: number[]
        removed: number[]
      }) => {
        const states =
          stateRef.current.supabaseProviderInstance?.awareness.getStates() as Map<
            number,
            { presence: TLInstancePresence }
          >
        console.log('🚀 ~ handleSync > handleUpdate > states:', states)

        const toRemove: TLInstancePresence['id'][] = []
        const toPut: TLInstancePresence[] = []

        // Connect records to put / remove
        for (const clientId of update.added) {
          const state = states.get(clientId)
          if (state?.presence && stateRef.current.presence.id !== presenceId) {
            toPut.push(stateRef.current.presence)
          }
        }

        for (const clientId of update.updated) {
          const state = states.get(clientId)
          if (state?.presence && stateRef.current.presence.id !== presenceId) {
            toPut.push(stateRef.current.presence)
          }
        }

        for (const clientId of update.removed) {
          toRemove.push(
            InstancePresenceRecordType.createId(clientId.toString())
          )
        }

        // put / remove the records in the store
        stateRef.current.tlStore.mergeRemoteChanges(() => {
          if (toRemove.length) stateRef.current.tlStore.remove(toRemove)
          if (toPut.length) stateRef.current.tlStore.put(toPut)
        })
      }
      stateRef.current.supabaseProviderInstance?.awareness.on(
        'update',
        handleUpdate
      )

      const handleMetaUpdate = () => {
        const theirSchema = stateRef.current.meta.get('schema')
        console.log('🚀 ~ handleMetaUpdate ~ theirSchema:', theirSchema)
        if (!theirSchema) {
          throw new Error('No schema found in the yjs doc')
        }
        // If the shared schema is newer than our schema, the user must refresh
        const newMigrations =
          stateRef.current.tlStore.schema.getMigrationsSince(theirSchema)

        if (!newMigrations.ok || newMigrations.value.length > 0) {
          window.alert('The schema has been updated. Please refresh the page.')
          stateRef.current.yDocInstance!.destroy()
        }
      }
      stateRef.current.meta.observe(handleMetaUpdate)

      if (stateRef.current.yStore.yarray.length) {
        console.log(
          '🚀 ~ handleSync ~ stateRef.current.yStore.yarray:',
          stateRef.current.yStore.yarray
        )
        // Replace the store records with the yjs doc records
        const ourSchema = stateRef.current.tlStore.schema.serialize()
        const theirSchema = stateRef.current.meta.get('schema')
        if (!theirSchema) {
          throw new Error('No schema found in the yjs doc')
        }

        const records = stateRef.current.yStore.yarray
          .toJSON()
          .map(({ val }) => val)

        const migrationResult =
          stateRef.current.tlStore.schema.migrateStoreSnapshot({
            schema: theirSchema,
            store: Object.fromEntries(
              records.map((record) => [record.id, record])
            ),
          })
        if (migrationResult.type === 'error') {
          // if the schema is newer than ours, the user must refresh
          console.error(migrationResult.reason)
          window.alert('The schema has been updated. Please refresh the page.')

          return
        }

        stateRef.current.yDocInstance!.transact(() => {
          // delete any deleted records from the yjs doc
          for (const r of records) {
            if (!migrationResult.value[r.id]) {
              stateRef.current.yStore.delete(r.id)
            }
          }
          for (const r of Object.values(migrationResult.value) as TLRecord[]) {
            stateRef.current.yStore.set(r.id, r)
          }
          stateRef.current.meta.set('schema', ourSchema)
        })

        stateRef.current.tlStore.loadSnapshot({
          store: migrationResult.value,
          schema: ourSchema,
        })
      } else {
        // Create the initial store records
        // Sync the store records to the yjs doc
        stateRef.current.yDocInstance!.transact(() => {
          for (const record of stateRef.current.tlStore.allRecords()) {
            stateRef.current.yStore.set(record.id, record)
          }
          stateRef.current.meta.set(
            'schema',
            stateRef.current.tlStore.schema.serialize()
          )
        })
      }

      stateRef.current.status = 'synced-remote'
    }

    console.log(
      '🚀 ~ stateRef.current.supabaseProviderInstance?.on ~ stateRef.current.supabaseProviderInstance:',
      stateRef.current.supabaseProviderInstance
    )
    stateRef.current.supabaseProviderInstance?.on('status', (event) => {
      console.log(
        '🚀 ~ stateRef.current.supabaseProviderInstance?.on ~ status:',
        event
      )
      if (event?.status === 'connected') {
        console.log(
          '🚀 ~ stateRef.current.supabaseProviderInstance?.on ~ status 1:',
          event
        )
        stateRef.current.supabaseProviderInstance?.on('sync', handleSync)
      }
    })
  }, [])

  const readOnly = preview || (!isOwner && slide.config?.allowToDraw)

  console.log('🚀 ~ MoraaBoard ~ tlStore.status:', stateRef.current.tlStore)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="relative w-full flex-auto flex flex-col justify-center items-center px-4 z-[0] h-full">
      {!stateRef.current.tlStore ? (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <ContentLoading />
        </div>
      ) : (
        <Tldraw
          // persistenceKey={roomId}
          autoFocus
          store={stateRef.current.tlStore}
          components={
            {
              // SharePanel: preview ? null : NameEditor,
            }
          }
          onMount={(editor) => {
            editor.updateInstanceState({ isReadonly: !!readOnly })
          }}
        />
      )}
    </div>
  )
}

// const NameEditor = track(() => {
//   const editor = useEditor()
//   const name = 'Test'

//   useEffect(() => {
//     editor.user.updateUserPreferences({
//       name,
//     })
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [name])

//   const { color } = editor.user.getUserPreferences()

//   return (
//     <div className="flex justify-end items-center gap-1 pointer-events-auto">
//       <input
//         type="color"
//         className="w-12 cursor-pointer"
//         value={color}
//         onChange={(e) => {
//           editor.user.updateUserPreferences({
//             color: e.currentTarget.value,
//           })
//         }}
//       />
//       <span>{name}</span>
//     </div>
//   )
// })
