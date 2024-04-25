import { OnDragEndResponder } from 'react-beautiful-dnd'

import { ISection, ISlide } from './slide.type'

export type EventModeType = 'view' | 'edit' | 'present'

export type EventContextType = {
  eventMode: EventModeType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meeting: any
  currentSlide: ISlide | null
  loading: boolean
  syncing: boolean
  isOwner: boolean
  sections: ISection[]
  insertAfterSectionId: string | null
  insertAfterSlideId: string | null
  showSectionPlaceholder: boolean
  showSlidePlaceholder: boolean
  insertInSectionId: string | null
  preview: boolean
  setPreview: (preview: boolean) => void
  error: { slideId: string; message: string } | null
  setInsertAfterSlideId: (slideId: string | null) => void
  setInsertAfterSectionId: (sectionId: string | null) => void
  setCurrentSlide: (slide: ISlide) => void
  addSlideToSection: ({
    slide,
    section,
    afterSlideId,
  }: {
    slide: Partial<ISlide>
    section?: Partial<ISection>
    afterSlideId?: string
  }) => void
  updateSlide: ({
    slidePayload,
    slideId,
    allowNonOwnerToUpdate,
  }: {
    slidePayload: Partial<ISlide>
    slideId: string
    allowNonOwnerToUpdate?: boolean
  }) => void
  deleteSlide: (slide: ISlide) => void
  importGoogleSlides: (data: {
    slide: ISlide
    googleSlideUrl: string
    startPosition: number
    endPosition: number | undefined
  }) => void
  moveUpSlide: (slide: ISlide) => void
  moveDownSlide: (slide: ISlide) => void
  reorderSlide: OnDragEndResponder
  reorderSection: OnDragEndResponder
  addSection: ({
    name,
    afterSectionId,
  }: {
    name?: string
    afterSectionId?: string
  }) => void
  updateSection: ({
    sectionPayload,
    sectionId,
    meetingId,
  }: {
    sectionPayload: {
      name?: string
      slides?: string[]
    }
    sectionId?: string
    meetingId?: string
  }) => void
  deleteSection?: ({ sectionId }: { sectionId: string }) => void
  setInsertInSectionId: (sectionId: string | null) => void
  moveUpSection: (section: ISection) => void
  moveDownSection: (section: ISection) => void
}
