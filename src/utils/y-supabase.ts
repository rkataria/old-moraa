/* eslint-disable max-classes-per-file */
import { EventEmitter } from 'events'

import { RealtimeChannel, REALTIME_LISTEN_TYPES } from '@supabase/realtime-js'
import { SupabaseClient } from '@supabase/supabase-js'
import debug from 'debug'
import * as awarenessProtocol from 'y-protocols/awareness'
import * as Y from 'yjs'

import { supabaseClient } from './supabase/client'

export interface SupabaseProviderConfig {
  channel: string
  tableName: string
  columnName: string
  idName?: string
  id: string | number
  awareness?: awarenessProtocol.Awareness
  resyncInterval?: number | false
}

export class SupabaseProvider extends EventEmitter {
  public awareness: awarenessProtocol.Awareness
  public connected = false
  private channel: RealtimeChannel | null = null

  private _synced: boolean = false
  private resyncInterval: NodeJS.Timeout | undefined
  protected logger: debug.Debugger
  public readonly id: number

  public isChannelSubscribed: boolean = false
  public dbSyncTimeout: NodeJS.Timeout | null = null

  public version: number = 0

  constructor(
    private doc: Y.Doc,
    private supabase: SupabaseClient,
    private config: SupabaseProviderConfig
  ) {
    super()

    this.awareness =
      this.config.awareness || new awarenessProtocol.Awareness(doc)

    this.config = config || {}
    this.id = doc.clientID

    this.isChannelSubscribed = false

    this.supabase = supabaseClient
    this.on('connect', this.onConnect)
    this.on('disconnect', this.onDisconnect)

    this.logger = debug(`y-${doc.clientID}`)
    // turn on debug logging to the console
    this.logger.enabled = false // import.meta.env.NODE_ENV === 'development' // Enable debug logging in development

    this.logger('constructor initializing')
    this.logger('connecting to Supabase Realtime', doc.guid)

    if (
      this.config.resyncInterval ||
      typeof this.config.resyncInterval === 'undefined'
    ) {
      if (this.config.resyncInterval && this.config.resyncInterval < 3000) {
        throw new Error('resync interval of less than 3 seconds')
      }
      this.logger(
        `setting resync interval to every ${(this.config.resyncInterval || 5000) / 1000} seconds`
      )
      this.resyncInterval = setInterval(() => {
        this.logger('resyncing (resync interval elapsed)')
        this.emit('message', Y.encodeStateAsUpdate(this.doc))
        // Only broadcast if current user is subscribed the channel to avoid unnecessary rest calls
        if (this.channel && this.isChannelSubscribed) {
          this.channel.send({
            type: 'broadcast',
            event: 'message',
            payload: {
              data: Array.from(Y.encodeStateAsUpdate(this.doc)),
            },
          })
        }
      }, this.config.resyncInterval || 5000)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(
        'beforeunload',
        this.removeSelfFromAwarenessOnUnload
      )
    } else if (typeof process !== 'undefined') {
      process.on('exit', () => this.removeSelfFromAwarenessOnUnload)
    }
    this.on('awareness', (update) => {
      // Only broadcast if current user is subscribed the channel to avoid unnecessary rest calls
      if (this.channel && this.isChannelSubscribed) {
        // TODO: use supabase presence event instead of yjs awareness
        this.channel.send({
          type: 'broadcast',
          event: 'awareness',
          payload: {
            data: Array.from(update),
          },
        })
      }
    })
    this.on('message', (update) => {
      // Only broadcast if current user is subscribed the channel to avoid unnecessary rest calls
      if (this.channel && this.isChannelSubscribed) {
        this.channel.send({
          type: 'broadcast',
          event: 'message',
          payload: {
            data: Array.from(update),
          },
        })
      }
    })

    this.connect()
    this.doc.on('update', this.onDocumentUpdate.bind(this))
    this.awareness.on('update', this.onAwarenessUpdate.bind(this))
  }

  isOnline(online?: boolean): boolean {
    if (!online && online !== false) return this.connected
    this.connected = online

    return this.connected
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDocumentUpdate(update: Uint8Array, origin: any) {
    if (origin !== this) {
      this.logger(
        'document updated locally, broadcasting update to peers',
        this.isOnline()
      )
      this.emit('message', update)
      this.save()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  onAwarenessUpdate({ added, updated, removed }: any, _origin: any) {
    const changedClients = added.concat(updated).concat(removed)
    const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
      this.awareness,
      changedClients
    )
    this.emit('awareness', awarenessUpdate)
  }

  removeSelfFromAwarenessOnUnload() {
    awarenessProtocol.removeAwarenessStates(
      this.awareness,
      [this.doc.clientID],
      'window unload'
    )
  }

  async save() {
    // Saving to the database is debounced to avoid excessive writes
    if (this.dbSyncTimeout) {
      clearTimeout(this.dbSyncTimeout)
    }
    this.dbSyncTimeout = setTimeout(async () => {
      const content = Array.from(Y.encodeStateAsUpdate(this.doc))

      const { data, error: fetchFrameError } = await this.supabase
        .from(this.config.tableName)
        .select('*')
        .eq(this.config.idName || 'id', this.config.id)
        .single()

      if (fetchFrameError) {
        return
      }

      const { error } = await this.supabase
        .from(this.config.tableName)
        .update({
          [this.config.columnName]: {
            ...data[this.config.columnName],
            document: content,
          },
        })
        .eq(this.config.idName || 'id', this.config.id)

      if (error) {
        throw error
      }

      this.emit('save', this.version)
    }, 2000)
  }

  private async onConnect() {
    this.logger('connected')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, status } = await this.supabase
      .from(this.config.tableName)
      .select<string, { [key: string]: { document: number[] } }>(
        `${this.config.columnName}`
      )
      .eq(this.config.idName || 'id', this.config.id)
      .single()

    this.logger('retrieved data from supabase', status, data)

    if (data && data[this.config.columnName].document) {
      this.logger('applying update to yjs')
      try {
        this.applyUpdate(Uint8Array.from(data[this.config.columnName].document))
        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        this.logger(error)
      }
    }

    this.logger('setting connected flag to true')
    this.isOnline(true)

    this.emit('status', { status: 'connected' })

    if (this.awareness.getLocalState() !== null) {
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        [this.doc.clientID]
      )
      this.emit('awareness', awarenessUpdate)
    }

    this.synced = true
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyUpdate(update: Uint8Array, origin?: any) {
    // eslint-disable-next-line no-plusplus
    this.version++
    Y.applyUpdate(this.doc, update, origin)
  }

  private disconnect() {
    if (this.channel) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.supabase.removeChannel(this.channel as any)
      this.channel = null
    }
  }

  private connect() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.channel = this.supabase.channel(this.config.channel) as any
    if (this.channel) {
      this.channel
        .on(
          REALTIME_LISTEN_TYPES.BROADCAST,
          { event: 'message' },
          ({ payload }) => {
            this.onMessage(Uint8Array.from(payload.data))
          }
        )
        .on(
          REALTIME_LISTEN_TYPES.BROADCAST,
          { event: 'awareness' },
          ({ payload }) => {
            this.onAwareness(Uint8Array.from(payload.data))
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            this.emit('connect', this)
            this.isChannelSubscribed = true
          }

          if (status === 'CHANNEL_ERROR') {
            this.logger('CHANNEL_ERROR', err)
            this.emit('error', this)
            this.isChannelSubscribed = false
          }

          if (status === 'TIMED_OUT') {
            this.emit('disconnect', this)
            this.isChannelSubscribed = false
          }

          if (status === 'CLOSED') {
            this.emit('disconnect', this)
            this.isChannelSubscribed = false
          }
        })
    }
  }

  get synced() {
    return this._synced
  }

  set synced(state) {
    if (this._synced !== state) {
      this.logger(`setting sync state to ${state}`)
      this._synced = state
      this.emit('synced', [state])
      this.emit('sync', [state])
    }
  }

  public onConnecting() {
    if (!this.isOnline()) {
      this.logger('connecting')
      this.emit('status', { status: 'connecting' })
    }
  }

  public onDisconnect() {
    this.logger('disconnected')

    this.synced = false
    this.isOnline(false)
    this.logger('set connected flag to false')
    if (this.isOnline()) {
      this.emit('status', { status: 'disconnected' })
    }

    // update awareness (keep all users except local)
    // FIXME? compare to broadcast channel behavior
    const states = Array.from(this.awareness.getStates().keys()).filter(
      (client) => client !== this.doc.clientID
    )
    awarenessProtocol.removeAwarenessStates(this.awareness, states, this)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public onMessage(message: Uint8Array) {
    if (!this.isOnline()) return
    try {
      this.applyUpdate(message, this)
    } catch (err) {
      this.logger(err)
    }
  }

  public onAwareness(message: Uint8Array) {
    awarenessProtocol.applyAwarenessUpdate(this.awareness, message, this)
  }

  public onAuth(message: Uint8Array) {
    this.logger(`received ${message.byteLength} bytes from peer: ${message}`)

    if (!message) {
      this.logger('Permission denied to channel')
    }
    this.logger('processed message (type = MessageAuth)')
  }

  public destroy() {
    this.logger('destroying')

    if (this.resyncInterval) {
      clearInterval(this.resyncInterval)
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener(
        'beforeunload',
        this.removeSelfFromAwarenessOnUnload
      )
    } else if (typeof process !== 'undefined') {
      process.off('exit', () => this.removeSelfFromAwarenessOnUnload)
    }

    this.awareness.off('update', this.onAwarenessUpdate)
    this.doc.off('update', this.onDocumentUpdate)

    if (this.channel) this.disconnect()
  }
}
