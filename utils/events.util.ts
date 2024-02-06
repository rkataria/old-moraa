export enum SlideEventManagerType {
  OnRight = "OnRight",
  OnLeft = "OnLeft",
}

class SlideEventTarget extends EventTarget {}

class SlideEventManager extends Event {
  customTarget: SlideEventTarget
  customEvent: SlideEventManagerType

  constructor(event: SlideEventManagerType) {
    super(event)
    this.customTarget = new SlideEventTarget()
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

export const SlideEvents = {
  [SlideEventManagerType.OnRight]: new SlideEventManager(
    SlideEventManagerType.OnRight
  ),
  [SlideEventManagerType.OnLeft]: new SlideEventManager(
    SlideEventManagerType.OnLeft
  ),
}
