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
  currentSlideLoading: boolean
  currentSlideResponses: any[] | null
  editing: boolean
  syncSlides: () => void
  updateSlide: (slide: ISlide) => void
  enableEditing: () => void
  disableEditing: () => void
  startPresentation: () => void
  stopPresentation: () => void
  pausePresentation: () => void
  setCurrentSlide: (slide: ISlide) => void
  nextSlide: () => void
  previousSlide: () => void
  votePoll: (slide: ISlide, option: string) => void
  addReflection?: (slide: ISlide, reflection: string, username: string) => void
}
