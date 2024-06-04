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
  showSectionPlaceholder: boolean
  showSlidePlaceholder: boolean
  preview: boolean
  insertAfterSectionId: string | null
  insertAfterSlideId: string | null
  insertInSectionId: string | null
  selectedSectionId: string | null
  error: { slideId: string; message: string } | null
  setInsertAfterSlideId: (slideId: string | null) => void
  setInsertAfterSectionId: (sectionId: string | null) => void
  setInsertInSectionId: (sectionId: string | null) => void
  setSelectedSectionId: (sectionId: string | null) => void
  setPreview: (preview: boolean) => void
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
    allowParticipantToUpdate,
  }: {
    slidePayload: Partial<ISlide>
    slideId: string
    allowParticipantToUpdate?: boolean
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
  deleteSection: ({
    sectionId,
    meetingId,
  }: {
    sectionId: string
    meetingId: string
  }) => void
  moveUpSection: (section: ISection) => void
  moveDownSection: (section: ISection) => void
}
