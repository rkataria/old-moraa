/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject } from 'react'

import { ISlide } from './slide.type'

export enum PresentationStatuses {
  STARTED = 'started',
  STOPPED = 'stopped',
  PAUSED = 'paused',
}

export type VideoMiddlewareConfig = {
  previousConfig?: {
    type: string
    value: any
  }
  type: string | null
  value: string | number | null
}

export type SlideReaction = {
  id: string
  reaction: string
  slide_response_id: string
  participant_id: string
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
  activeStateSession: any
  syncing: boolean
  videoMiddlewareConfig: VideoMiddlewareConfig | null
  slideReactions: SlideReaction[]
  syncSlides: () => void
  startPresentation: () => void
  stopPresentation: () => void
  pausePresentation: () => void
  setCurrentSlide: (slide: ISlide) => void
  nextSlide: () => void
  previousSlide: () => void
  setCurrentSlideByID: (id: string) => void
  onVote: (slide: ISlide, options: string[]) => void
  addReflection?: (slide: ISlide, reflection: string, username: string) => void
  updateReflection?: (id: string, reflection: string, username: string) => void
  emoteOnReflection?: ({
    participantId,
    reaction,
    slideResponseId,
    reactionId,
  }: {
    participantId: string
    reaction: string
    slideResponseId?: string
    reactionId?: string
  }) => void
  joinMeeting?: () => void
  reorderSlide: (result: any) => void
  moveUpSlide: (id: string) => void
  moveDownSlide: (id: string) => void
  deleteSlide: (id: string) => void
  updateSlide: (slide: ISlide) => void
  changeCurrentSlide: (slide: ISlide) => void
  onToggleHandRaised: ({
    handRaise,
    participantId,
    participantName,
  }: {
    handRaise: boolean
    participantId: string
    participantName: string
  }) => void
  setVideoMiddlewareConfig: (config: VideoMiddlewareConfig) => void
  updateTypingUsers: ({
    isTyping,
    participantId,
    participantName,
  }: {
    isTyping: boolean
    participantId: string
    participantName?: string
  }) => void
}
