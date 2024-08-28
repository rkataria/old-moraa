/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dispatch, SetStateAction } from 'react'

import { VideoMiddleware } from '@dytesdk/web-core'
import { RealtimeChannel } from '@supabase/supabase-js'

import type { IPollResponse, IReflectionResponse, IFrame } from './frame.type'

export enum PresentationStatuses {
  STARTED = 'started',
  STOPPED = 'stopped',
  PAUSED = 'paused',
}

export enum EventSessionMode {
  PREVIEW = 'Preview',
  LOBBY = 'Lobby',
  PRESENTATION = 'Presentation',
}

export type VideoMiddlewareConfig = {
  previousConfig?: {
    type: string
    value: any
  }
  type: string | null
  value: string | number | null
  currentMiddleware?: VideoMiddleware
}

export type FrameReaction = {
  id: string
  reaction: string
  frame_response_id: string
  participant_id: string
}

export type DyteStates = {
  [key: string]: string | boolean
}

export type EventSessionContextType = {
  isHost: boolean
  currentFrame: IFrame | null
  presentationStatus: PresentationStatuses
  currentFrameLoading: boolean
  currentFrameResponses?: IReflectionResponse[] | IPollResponse[] | null
  participant: any
  activeSession: any
  videoMiddlewareConfig: VideoMiddlewareConfig | null
  frameReactions: FrameReaction[]
  realtimeChannel?: RealtimeChannel | null
  eventSessionMode: EventSessionMode
  isBreakoutSlide: boolean
  dyteStates: DyteStates
  setDyteStates: Dispatch<SetStateAction<DyteStates>>
  breakoutSlideId: string | null
  setIsBreakoutSlide: Dispatch<SetStateAction<boolean>>
  setBreakoutSlideId: Dispatch<SetStateAction<string | null>>
  isCreateBreakoutOpen: boolean
  setIsCreateBreakoutOpen: Dispatch<SetStateAction<boolean>>
  startPresentation: () => void
  stopPresentation: () => void
  pausePresentation: () => void
  setCurrentFrame: (frame: IFrame) => void
  nextFrame: () => void
  previousFrame: () => void
  onVote: (
    frame: IFrame,
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
    frame,
    reflection,
    username,
    anonymous,
  }: {
    frame: IFrame
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
    frameResponseId,
    reactionId,
    action,
  }: {
    participantId: string
    reaction: string
    frameResponseId?: string
    reactionId?: string
    action: string
  }) => void
  addParticipant?: () => void
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
