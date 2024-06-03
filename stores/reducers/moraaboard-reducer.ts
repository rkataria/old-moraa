/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'
import {
  InstancePresenceRecordType,
  SerializedSchema,
  TLInstancePresence,
  TLRecord,
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

import type { PayloadAction } from '@reduxjs/toolkit'

import { supabaseClient } from '@/utils/supabase/client'
import { SupabaseProvider } from '@/utils/y-supabase'

export interface IMoraaboardSlice {
  meta: any | null
  tlStore: any | null
  yStore: any | null
  yDocInstance: Y.Doc | null
  supabaseProviderInstance: SupabaseProvider | null
  isInitialized: boolean
  isReady: boolean
  status: 'synced-remote' | 'loading'
}

const initialState: IMoraaboardSlice = {
  meta: null,
  tlStore: null,
  yStore: null,
  yDocInstance: null,
  supabaseProviderInstance: null,
  isInitialized: false,
  isReady: false,
  status: 'loading',
}

export const moraaboardSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initMoraaboardInstances: (
      state,
      action: PayloadAction<{ roomId: string; slideId: string }>
    ) => {
      console.log('🚀 ~ action:', action)
      state.tlStore = createTLStore({
        shapeUtils: defaultShapeUtils,
      })

      state.yDocInstance = new Y.Doc({ gc: true })
      const yArr = state.yDocInstance.getArray<{ key: string; val: TLRecord }>(
        `tl_${action.payload.slideId}`
      )
      state.yStore = new YKeyValue(yArr)
      state.meta = state.yDocInstance.getMap<SerializedSchema>('meta')

      state.supabaseProviderInstance = new SupabaseProvider(
        state.yDocInstance,
        supabaseClient,
        {
          channel: action.payload.roomId,
          id: action.payload.slideId,
          tableName: 'slide',
          columnName: 'content',
          resyncInterval: 1000 * 30,
        }
      )

      state.isInitialized = true
    },
    startMoraaboard: (state) => {
      state.isReady = false

      function handleSync() {
        state.tlStore.listen(
          ({ changes }) => {
            console.log('🚀 ~ handleSync > tlStore > changes:', changes)
            state.yDocInstance.transact(() => {
              Object.values(changes.added).forEach((record) => {
                state.yStore.set(record.id, record)
              })

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              Object.values(changes.updated).forEach(([_, record]) => {
                state.yStore.set(record.id, record)
              })

              Object.values(changes.removed).forEach((record) => {
                state.yStore.delete(record.id)
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
                const record = state.yStore.get(id)!
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
          state.tlStore.mergeRemoteChanges(() => {
            if (toRemove.length) state.tlStore.remove(toRemove)
            if (toPut.length) state.tlStore.put(toPut)
          })
        }
        state.yStore.on('change', handleChange)

        const yClientId =
          state.supabaseProviderInstance?.awareness.clientID.toString()
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
        )(state.yStore)

        // Set our initial presence from the derivation's current value
        state.supabaseProviderInstance?.awareness.setLocalStateField(
          'presence',
          presenceDerivation.get()
        )

        // When the derivation change, sync presence to to yjs awareness
        react('when presence changes', () => {
          const presence = presenceDerivation.get()
          requestAnimationFrame(() => {
            state.supabaseProviderInstance?.awareness.setLocalStateField(
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
            state.supabaseProviderInstance?.awareness.getStates() as Map<
              number,
              { presence: TLInstancePresence }
            >
          console.log('🚀 ~ handleSync > handleUpdate > states:', states)

          const toRemove: TLInstancePresence['id'][] = []
          const toPut: TLInstancePresence[] = []

          // Connect records to put / remove
          for (const clientId of update.added) {
            const state = states.get(clientId)
            if (state?.presence && state.presence.id !== presenceId) {
              toPut.push(state.presence)
            }
          }

          for (const clientId of update.updated) {
            const state = states.get(clientId)
            if (state?.presence && state.presence.id !== presenceId) {
              toPut.push(state.presence)
            }
          }

          for (const clientId of update.removed) {
            toRemove.push(
              InstancePresenceRecordType.createId(clientId.toString())
            )
          }

          // put / remove the records in the store
          state.tlStore.mergeRemoteChanges(() => {
            if (toRemove.length) state.tlStore.remove(toRemove)
            if (toPut.length) state.tlStore.put(toPut)
          })
        }
        state.supabaseProviderInstance?.awareness.on('update', handleUpdate)

        const handleMetaUpdate = () => {
          const theirSchema = state.meta.get('schema')
          console.log('🚀 ~ handleMetaUpdate ~ theirSchema:', theirSchema)
          if (!theirSchema) {
            throw new Error('No schema found in the yjs doc')
          }
          // If the shared schema is newer than our schema, the user must refresh
          const newMigrations =
            state.tlStore.schema.getMigrationsSince(theirSchema)

          if (!newMigrations.ok || newMigrations.value.length > 0) {
            window.alert(
              'The schema has been updated. Please refresh the page.'
            )
            state.yDocInstance!.destroy()
          }
        }
        state.meta.observe(handleMetaUpdate)

        if (state.yStore.yarray.length) {
          console.log(
            '🚀 ~ handleSync ~ state.yStore.yarray:',
            state.yStore.yarray
          )
          // Replace the store records with the yjs doc records
          const ourSchema = state.tlStore.schema.serialize()
          const theirSchema = state.meta.get('schema')
          if (!theirSchema) {
            throw new Error('No schema found in the yjs doc')
          }

          const records = state.yStore.yarray.toJSON().map(({ val }) => val)

          const migrationResult = state.tlStore.schema.migrateStoreSnapshot({
            schema: theirSchema,
            store: Object.fromEntries(
              records.map((record) => [record.id, record])
            ),
          })
          if (migrationResult.type === 'error') {
            // if the schema is newer than ours, the user must refresh
            console.error(migrationResult.reason)
            window.alert(
              'The schema has been updated. Please refresh the page.'
            )

            return
          }

          state.yDocInstance!.transact(() => {
            // delete any deleted records from the yjs doc
            for (const r of records) {
              if (!migrationResult.value[r.id]) {
                state.yStore.delete(r.id)
              }
            }
            for (const r of Object.values(
              migrationResult.value
            ) as TLRecord[]) {
              state.yStore.set(r.id, r)
            }
            state.meta.set('schema', ourSchema)
          })

          state.tlStore.loadSnapshot({
            store: migrationResult.value,
            schema: ourSchema,
          })
        } else {
          // Create the initial store records
          // Sync the store records to the yjs doc
          state.yDocInstance!.transact(() => {
            for (const record of state.tlStore.allRecords()) {
              state.yStore.set(record.id, record)
            }
            state.meta.set('schema', state.tlStore.schema.serialize())
          })
        }

        state.status = 'synced-remote'
      }

      console.log(
        '🚀 ~ state.supabaseProviderInstance?.on ~ state.supabaseProviderInstance:',
        state.supabaseProviderInstance
      )
      state.supabaseProviderInstance?.on('status', (event) => {
        console.log('🚀 ~ state.supabaseProviderInstance?.on ~ status:', event)
        if (event?.status === 'connected') {
          console.log(
            '🚀 ~ state.supabaseProviderInstance?.on ~ status 1:',
            event
          )
          state.supabaseProviderInstance?.on('sync', handleSync)
        }
      })

      state.isReady = true
    },
  },
})

export const { initMoraaboardInstances, startMoraaboard } =
  moraaboardSlice.actions
export const moraaboardReducer = moraaboardSlice.reducer
