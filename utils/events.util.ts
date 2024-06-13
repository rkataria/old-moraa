/* eslint-disable max-classes-per-file */
export enum FrameEventManagerType {
  OnRight = 'OnRight',
  OnLeft = 'OnLeft',
}

class FrameEventTarget extends EventTarget {}

class FrameEventManager extends Event {
  customTarget: FrameEventTarget
  customEvent: FrameEventManagerType

  constructor(event: FrameEventManagerType) {
    super(event)
    this.customTarget = new FrameEventTarget()
    this.customEvent = event
  }

  dispatchEvent() {
    this.customTarget?.dispatchEvent(this)
  }
  subscribe(callback: () => void) {
    this.customTarget.addEventListener(this.customEvent, callback)
  }
  unsubscribe(callback: () => void) {
    this.customTarget.removeEventListener(this.customEvent, callback)
  }
}

export const FrameEvents = {
  [FrameEventManagerType.OnRight]: new FrameEventManager(
    FrameEventManagerType.OnRight
  ),
  [FrameEventManagerType.OnLeft]: new FrameEventManager(
    FrameEventManagerType.OnLeft
  ),
}
