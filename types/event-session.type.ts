import { ISlide } from "./slide.type"

export enum PresentationStatuses {
  STARTED = "started",
  STOPPED = "stopped",
  PAUSED = "paused",
}

export type EventSessionContextType = {
  event: any
  loading: boolean
  error: any
  meetingToken: string
  isHost: boolean
  slides: ISlide[]
  currentSlide: ISlide | null
  presentationStatus: PresentationStatuses
  startPresentation: () => void
  stopPresentation: () => void
  pausePresentation: () => void
  setCurrentSlide: (slide: ISlide) => void
  nextSlide: () => void
  previousSlide: () => void
}
