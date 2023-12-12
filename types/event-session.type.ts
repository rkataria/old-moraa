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
  currentUser: any
  presentationStatus: PresentationStatuses
  currentSlideResponses: any[] | null
  startPresentation: () => void
  stopPresentation: () => void
  pausePresentation: () => void
  setCurrentSlide: (slide: ISlide) => void
  nextSlide: () => void
  previousSlide: () => void
  votePoll: (slide: ISlide, option: string) => void
}
