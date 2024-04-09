/* eslint-disable @typescript-eslint/no-explicit-any */

import { RealtimeChannel } from '@supabase/supabase-js'

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
  isHost: boolean
  currentSlide: ISlide | null
  presentationStatus: PresentationStatuses
  currentSlideLoading: boolean
  currentSlideResponses: any[] | null
  participant: any
  activeSession: any
  videoMiddlewareConfig: VideoMiddlewareConfig | null
  slideReactions: SlideReaction[]
  realtimeChannel: RealtimeChannel
  startPresentation: () => void
  stopPresentation: () => void
  pausePresentation: () => void
  setCurrentSlide: (slide: ISlide) => void
  nextSlide: () => void
  previousSlide: () => void
  onVote: (
    slide: ISlide,
    {
      selectedOptions,
      anonymous,
    }: {
      selectedOptions: string[]
      anonymous: boolean
    }
  ) => void
  onUpdateVote: (
    responseId: string,
    {
      anonymous,
      ...rest
    }: {
      anonymous: boolean
    }
  ) => void
  addReflection?: ({
    slide,
    reflection,
    username,
    anonymous,
  }: {
    slide: ISlide
    reflection: string
    username: string
    anonymous: boolean
  }) => void
  updateReflection?: ({
    id,
    reflection,
    username,
    anonymous,
  }: {
    id: string
    reflection: string
    username: string
    anonymous: boolean
  }) => void
  emoteOnReflection?: ({
    participantId,
    reaction,
    slideResponseId,
    reactionId,
    action,
  }: {
    participantId: string
    reaction: string
    slideResponseId?: string
    reactionId?: string
    action: string
  }) => void
  joinMeeting?: () => void
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
  flyEmoji: ({ emoji, name }: { emoji: string; name: string }) => void
  updateActiveSession: (data: any) => void
}
