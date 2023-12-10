import { ContentType } from "@/components/slides/ContentTypePicker"

export type SlideMode = "edit" | "present"

export interface ISlide {
  id: string
  name: string
  content?: any
  createdAt?: string
  updatedAt?: string
  config: {
    backgroundColor: string
    textColor: string
  }
  contentType: (typeof ContentType)[keyof typeof ContentType]
}

export type SlideManagerContextType = {
  slides: ISlide[]
  currentSlide: ISlide | null
  loading: boolean
  syncing: boolean
  miniMode: boolean
  setMiniMode: (miniMode: boolean) => void
  setCurrentSlide: (slide: ISlide) => void
  addNewSlide: (slide: ISlide) => void
  updateSlide: (slide: ISlide) => void
  deleteSlide: (id: string) => void
  moveUpSlide: (id: string) => void
  moveDownSlide: (id: string) => void
}
