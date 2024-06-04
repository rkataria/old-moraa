/* eslint-disable @typescript-eslint/no-unused-vars */
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
      const tlStore = createTLStore({
        shapeUtils: defaultShapeUtils,
      })
      state.tlStore = tlStore

      const yDocInstance = new Y.Doc({ gc: true })
      state.yDocInstance = yDocInstance

      const yArr = state.yDocInstance.getArray<{ key: string; val: TLRecord }>(
        `tl_${action.payload.slideId}`
      )
      const yStore = new YKeyValue(yArr)
      state.yStore = yStore

      const meta = state.yDocInstance.getMap<SerializedSchema>('meta')
      state.meta = meta

      const supabaseProviderInstance = new SupabaseProvider(
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
      state.supabaseProviderInstance = supabaseProviderInstance

      function handleSync() {
        // Register TLStore changes on YDoc.

        const handleChangesOnTLStore = ({ changes }) => {
          console.log('🚀 ~ handleSync > tlStore > changes:', changes)
          yDocInstance.transact(() => {
            Object.values(changes.added).forEach((record) => {
              yStore.set(record.id, record)
            })

            Object.values(changes.updated).forEach(([_, record]) => {
              yStore.set(record.id, record)
            })

            Object.values(changes.removed).forEach((record) => {
              yStore.delete(record.id)
            })
          })
        }
        tlStore.listen(handleChangesOnTLStore, {
          source: 'user',
          scope: 'document',
        })

        const handleChangesOnYDoc = (
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
                const record = yStore.get(id)!
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
          tlStore.mergeRemoteChanges(() => {
            if (toRemove.length) tlStore.remove(toRemove)
            if (toPut.length) tlStore.put(toPut)
          })
        }
        yStore.on('change', handleChangesOnYDoc)

        const yClientId =
          supabaseProviderInstance?.awareness.clientID.toString()
        console.log('🚀 ~ handleSync ~ yClientId:', yClientId)
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

        const presenceId = InstancePresenceRecordType.createId(yClientId)
        const presenceDerivation = createPresenceStateDerivation(
          userPreferences,
          presenceId
        )(yStore)

        supabaseProviderInstance?.awareness.setLocalStateField(
          'presence',
          presenceDerivation.get()
        )

        react('when presence changes', () => {
          const presence = presenceDerivation.get()
          requestAnimationFrame(() => {
            supabaseProviderInstance?.awareness.setLocalStateField(
              'presence',
              presence
            )
          })
        })

        const onSupabaseAwarenessUpdate = (update: {
          added: number[]
          updated: number[]
          removed: number[]
        }) => {
          const states = supabaseProviderInstance?.awareness.getStates() as Map<
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
          tlStore.mergeRemoteChanges(() => {
            if (toRemove.length) tlStore.remove(toRemove)
            if (toPut.length) tlStore.put(toPut)
          })
        }

        supabaseProviderInstance.awareness.on(
          'update',
          onSupabaseAwarenessUpdate
        )

        const handleMetaUpdate = () => {
          const theirSchema = meta.get('schema')
          console.log('🚀 ~ handleMetaUpdate ~ theirSchema:', theirSchema)
          if (!theirSchema) {
            throw new Error('No schema found in the yjs doc')
          }
          // If the shared schema is newer than our schema, the user must refresh
          const newMigrations = tlStore.schema.getMigrationsSince(theirSchema)

          if (!newMigrations.ok || newMigrations.value.length > 0) {
            window.alert(
              'The schema has been updated. Please refresh the page.'
            )
            yDocInstance!.destroy()
          }
        }
        meta.observe(handleMetaUpdate)

        if (yStore.yarray.length) {
          console.log('🚀 ~ handleSync ~ yStore.yarray:', yStore.yarray)
          // Replace the store records with the yjs doc records
          const ourSchema = tlStore.schema.serialize()
          const theirSchema = meta.get('schema')
          if (!theirSchema) {
            throw new Error('No schema found in the yjs doc')
          }

          const records = yStore.yarray.toJSON().map(({ val }) => val)

          const migrationResult = tlStore.schema.migrateStoreSnapshot({
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

          yDocInstance!.transact(() => {
            // delete any deleted records from the yjs doc
            for (const r of records) {
              if (!migrationResult.value[r.id]) {
                yStore.delete(r.id)
              }
            }
            for (const r of Object.values(
              migrationResult.value
            ) as TLRecord[]) {
              yStore.set(r.id, r)
            }
            meta.set('schema', ourSchema)
          })

          tlStore.loadSnapshot({
            store: migrationResult.value,
            schema: ourSchema,
          })
        } else {
          // Create the initial store records
          // Sync the store records to the yjs doc
          yDocInstance!.transact(() => {
            for (const record of tlStore.allRecords()) {
              yStore.set(record.id, record)
            }
            meta.set('schema', tlStore.schema.serialize())
          })
        }
      }

      console.log(
        '🚀 ~ supabaseProviderInstance?.on ~ supabaseProviderInstance:',
        supabaseProviderInstance
      )
      supabaseProviderInstance?.on('status', (event) => {
        console.log('🚀 ~ supabaseProviderInstance?.on ~ status:', event)
        if (event?.status === 'connected') {
          console.log('🚀 ~ supabaseProviderInstance?.on ~ status 1:', event)
          supabaseProviderInstance?.on('sync', handleSync)
        }
      })

      state.isInitialized = true
    },
  },
})

export const { initMoraaboardInstances } = moraaboardSlice.actions
export const moraaboardReducer = moraaboardSlice.reducer
