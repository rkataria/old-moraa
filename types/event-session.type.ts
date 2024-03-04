import { MutableRefObject } from "react"
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
  metaData: MutableRefObject<any>
  participant: any
  syncSlides: () => void
  startPresentation: () => void
  stopPresentation: () => void
  pausePresentation: () => void
  setCurrentSlide: (slide: ISlide) => void
  nextSlide: () => void
  previousSlide: () => void
  setCurrentSlideByID: (id: string) => void
  votePoll: (slide: ISlide, option: string) => void
  addReflection?: (slide: ISlide, reflection: string, username: string) => void
  updateReflection?: (id: string, reflection: string, username: string) => void
  joinMeeting?: () => void
  syncing: boolean
  reorderSlide: (result: any) => void
  moveUpSlide: (id: string) => void
  moveDownSlide: (id: string) => void
}
