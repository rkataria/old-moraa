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
  PEEK = 'Peek',
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
  details: {
    name: string
    avatar_url: string
  }
}

export type DyteStates = {
  [key: string]: any
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
  eventRealtimeChannel?: RealtimeChannel | null
  eventSessionMode: EventSessionMode
  dyteStates: DyteStates
  setDyteStates: Dispatch<SetStateAction<DyteStates>>
  startPresentation: (frameId: string | null) => void
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
    details,
  }: {
    participantId: string
    reaction: string
    frameResponseId?: string
    reactionId?: string
    action: string
    details: {
      name: string
      avatar_url: string
    }
  }) => void
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
  flyEmoji: ({ emoji, name }: { emoji: string; name: string }) => void
  sendSoundAlert: ({ sound }: { sound: string }) => void
  updateActiveSession: (data: any) => void
}
