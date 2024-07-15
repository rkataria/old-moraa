import { Canvas } from 'fabric/fabric-impl'

type HistoryEventCallback = () => void

export class HistoryFeature {
  private canvas: Canvas
  private historyUndo: string[]
  private historyRedo: string[]
  private extraProps: string[]
  private historyNextState: string
  private historyProcessing: boolean

  constructor(canvas: Canvas) {
    this.canvas = canvas
    this.historyUndo = []
    this.historyRedo = []
    this.extraProps = ['selectable', 'editable']
    this.historyNextState = this._historyNext()
    this.historyProcessing = false

    this._historyInit()
  }

  private _historyNext(): string {
    return JSON.stringify(this.canvas.toDatalessJSON(this.extraProps))
  }

  private _historyInit() {
    this.canvas.on('object:added', this._historySaveAction.bind(this))
    this.canvas.on('object:removed', this._historySaveAction.bind(this))
    this.canvas.on('object:modified', this._historySaveAction.bind(this))
    this.canvas.on('object:skewing', this._historySaveAction.bind(this))
  }

  private _historyDispose() {
    this.canvas.off('object:added', this._historySaveAction.bind(this))
    this.canvas.off('object:removed', this._historySaveAction.bind(this))
    this.canvas.off('object:modified', this._historySaveAction.bind(this))
    this.canvas.off('object:skewing', this._historySaveAction.bind(this))
  }

  private _historySaveAction() {
    if (this.historyProcessing) return

    const json = this.historyNextState
    this.historyUndo.push(json)
    this.historyNextState = this._historyNext()
    this.canvas.fire('history:append', { json })
  }

  undo(callback?: HistoryEventCallback) {
    this.historyProcessing = true

    console.log('undo', this.historyUndo)

    const history = this.historyUndo.pop()
    if (history) {
      this.historyRedo.push(this._historyNext())
      this.historyNextState = history
      this._loadHistory(history, 'history:undo', callback)
    } else {
      this.historyProcessing = false
    }
  }

  redo(callback?: HistoryEventCallback) {
    this.historyProcessing = true

    const history = this.historyRedo.pop()
    if (history) {
      this.historyUndo.push(this._historyNext())
      this.historyNextState = history
      this._loadHistory(history, 'history:redo', callback)
    } else {
      this.historyProcessing = false
    }
  }

  private _loadHistory(
    history: string,
    event: string,
    callback?: HistoryEventCallback
  ) {
    this.canvas.loadFromJSON(history, () => {
      this.canvas.renderAll()
      this.canvas.fire(event)
      this.historyProcessing = false

      if (callback) callback()
    })
  }

  clearHistory() {
    this.historyUndo = []
    this.historyRedo = []
    this.canvas.fire('history:clear')
  }

  onHistory() {
    this.historyProcessing = false
    this._historySaveAction()
  }

  canUndo(): boolean {
    return this.historyUndo.length > 0
  }

  canRedo(): boolean {
    return this.historyRedo.length > 0
  }

  offHistory() {
    this.historyProcessing = true
  }
}
