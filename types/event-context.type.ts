import { Dispatch, SetStateAction } from 'react'

import { OnDragEndResponder } from 'react-beautiful-dnd'

import { ISection, IFrame } from './frame.type'

export type EventModeType = 'view' | 'edit' | 'present'

export type EventContextType = {
  eventMode: EventModeType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meeting: any
  currentFrame: IFrame | null
  overviewOpen: boolean
  loading: boolean
  syncing: boolean
  isOwner: boolean
  sections: ISection[]
  showSectionPlaceholder: boolean
  showFramePlaceholder: boolean
  preview: boolean
  insertAfterSectionId: string | null
  insertAfterFrameId: string | null
  insertInSectionId: string | null
  selectedSectionId: string | null
  error: { frameId: string; message: string } | null
  setInsertAfterFrameId: (frameId: string | null) => void
  setInsertAfterSectionId: (sectionId: string | null) => void
  setInsertInSectionId: (sectionId: string | null) => void
  setSelectedSectionId: (sectionId: string | null) => void
  setPreview: (preview: boolean) => void
  setCurrentFrame: (frame: IFrame) => void
  setOverviewOpen: (open: boolean) => void
  openContentTypePicker: boolean
  setOpenContentTypePicker: Dispatch<SetStateAction<boolean>>
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
  updateFrames: ({
    framePayload,
    frameIds,
  }: {
    framePayload: Partial<IFrame>
    frameIds: string[]
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
