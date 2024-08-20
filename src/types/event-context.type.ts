import { Dispatch, SetStateAction } from 'react'

import { OnDragEndResponder } from 'react-beautiful-dnd'

import { ISection, IFrame, ISectionConfig } from './frame.type'

export type EventModeType = 'view' | 'edit' | 'present'

export type EventContextType = {
  eventId: string
  eventMode: EventModeType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meeting: any
  currentFrame: IFrame | null
  overviewOpen: boolean
  loading: boolean
  syncing: boolean
  isOwner: boolean
  sections: ISection[]
  preview: boolean
  insertAfterSectionId: string | null
  insertAfterFrameId: string | null
  insertInSectionId: string | null
  selectedSectionId: string | null
  error: { frameId: string; message: string } | null
  currentSectionId: string | null
  setCurrentSectionId: (sectionId: string | null) => void
  setInsertAfterFrameId: (frameId: string | null) => void
  setInsertAfterSectionId: (sectionId: string | null) => void
  setInsertInSectionId: (sectionId: string | null) => void
  setSelectedSectionId: (sectionId: string | null) => void
  setPreview: (preview: boolean) => void
  setCurrentFrame: (frame: IFrame | null) => void
  setOverviewOpen: (open: boolean) => void
  openContentTypePicker: boolean
  setOpenContentTypePicker: Dispatch<SetStateAction<boolean>>
  setAddedFromSessionPlanner: Dispatch<SetStateAction<boolean>>
  addFrameToSection: ({
    frame,
    section,
    afterFrameId,
  }: {
    frame: Partial<IFrame>
    section?: Partial<ISection>
    afterFrameId?: string
  }) => void
  updateFrame: ({
    framePayload,
    frameId,
    allowParticipantToUpdate,
  }: {
    framePayload: Partial<IFrame>
    frameId: string
    allowParticipantToUpdate?: boolean
  }) => void
  deleteFrame: (frame: IFrame) => void
  importGoogleSlides: (data: {
    frame: IFrame
    googleSlideUrl: string
    startPosition: number
    endPosition: number | undefined
  }) => void
  moveUpFrame: (frame: IFrame) => void
  moveDownFrame: (frame: IFrame) => void
  reorderFrame: OnDragEndResponder
  reorderSection: OnDragEndResponder
  addSection: ({
    name,
    addToLast,
    afterSectionId,
  }: {
    name?: string
    addToLast?: boolean
    afterSectionId?: string
  }) => void
  updateSection: ({
    sectionPayload,
    sectionId,
    meetingId,
  }: {
    sectionPayload: {
      name?: string
      frames?: string[]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config?: ISectionConfig
    }
    sectionId?: string
    meetingId?: string
  }) => void
  deleteSection: ({ sectionId }: { sectionId: string }) => void
  moveUpSection: (section: ISection) => void
  moveDownSection: (section: ISection) => void
  getFrameById: (frameId: string) => IFrame
  deleteBreakoutFrames: (frame: IFrame) => void
}
