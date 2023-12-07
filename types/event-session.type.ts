import { ISlide } from "./slide.type"

export type EventSessionContextType = {
  event: any
  loading: boolean
  error: any
  meetingToken: string
  isHost: boolean
  slides: ISlide[]
  currentSlide: ISlide | null
  setCurrentSlide: (slide: ISlide) => void
  nextSlide: () => void
  previousSlide: () => void
}
