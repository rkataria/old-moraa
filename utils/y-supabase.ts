import { EventEmitter } from 'events'

import { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { RealtimeChannel, REALTIME_LISTEN_TYPES } from '@supabase/realtime-js'
import debug from 'debug'
import * as awarenessProtocol from 'y-protocols/awareness'
import * as Y from 'yjs'

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
  private resyncInterval: NodeJS.Timer | undefined
  protected logger: debug.Debugger
  public readonly id: number

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

    this.supabase = supabase
    this.on('connect', this.onConnect)
    this.on('disconnect', this.onDisconnect)

    this.logger = debug(`y-${doc.clientID}`)
    // turn on debug logging to the console
    this.logger.enabled = process.env.NODE_ENV === 'development' // Enable debug logging in development

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
        if (this.channel) {
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
      if (this.channel) {
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
      if (this.channel) {
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
  onAwarenessUpdate({ added, updated, removed }: any, origin: any) {
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
    const content = Array.from(Y.encodeStateAsUpdate(this.doc))

    const { error } = await this.supabase
      .from(this.config.tableName)
      .update({ [this.config.columnName]: { document: content } })
      .eq(this.config.idName || 'id', this.config.id)

    if (error) {
      throw error
    }

    this.emit('save', this.version)
  }

  private async onConnect() {
    this.logger('connected')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error, status } = await this.supabase
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
            this.onMessage(Uint8Array.from(payload.data), this)
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
          }

          if (status === 'CHANNEL_ERROR') {
            this.logger('CHANNEL_ERROR', err)
            this.emit('error', this)
          }

          if (status === 'TIMED_OUT') {
            this.emit('disconnect', this)
          }

          if (status === 'CLOSED') {
            this.emit('disconnect', this)
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
  public onMessage(message: Uint8Array, origin: any) {
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
