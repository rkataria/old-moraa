/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactNode } from 'react'

import { IReflectionReply } from './event-session.type'
import { type AgendaFrameDisplayType } from './event.type'

import { IUserProfile } from '@/components/common/UserAvatar'
import { FrameType } from '@/utils/frame-picker.util'

export type FrameMode = 'edit' | 'present'

export type Block = {
  id: string
  type: string
}

export type TextBlock = Block & {
  data: {
    html: string
  }
}

export type RichTextBlock = {
  id: string
  type: string
  data: {
    html: string
  }
}

export type FileBlock = Block & {
  data: {
    file: {
      url: string
      meta?: {
        name: string
        size: number
        type: string
      }
    }
  }
}

export interface ISection {
  id: string
  name: string
  created_at?: string
  updated_at?: string
  frames: IFrame[]
  meeting_id?: string
  status?: string
  config?: ISectionConfig
}

export interface IbreakoutRooms {
  name: string
  activityId?: string
  id: string
}
export interface ISectionConfig {
  time?: number
}
export interface IFrame {
  id: string
  name: string
  content?: {
    title?: string
    description?: string
    blocks?: TextBlock[] | FileBlock[]
    panelSizes?: number[]
    [key: string]: any
  }
  created_at?: string
  updated_at?: string
  config: any
  type: (typeof FrameType)[keyof typeof FrameType]
  order?: number
  meeting_id?: string
  section_id?: string
  status?: string
  // eslint-disable-next-line prettier/prettier
  notes?: any
}

export interface IMiniFrameManagerType {
  frame: IFrame
  index: number
  frameCount: number
  draggableProps: any
  displayType: AgendaFrameDisplayType
}

export interface IReflectionResponse {
  id: string
  dyte_meeting_id: string
  participant: {
    enrollment: {
      user_id: string
      profile: IUserProfile
    }
  }
  response: {
    username: string
    reflection: string
    anonymous?: boolean
    reply?: IReflectionReply
  }
}

export interface IWordCloudResponse {
  id: string
  dyte_meeting_id: string
  participant: {
    enrollment: {
      user_id: string
      profile: IUserProfile
    }
  }
  response: {
    words: string[]
  }
}

export interface IPollResponse {
  id: string
  participant: {
    enrollment: {
      user_id: string
    }
  }
}

export interface PollOption {
  name: string
  color: string
  id: string
}

export interface PollPreviewOption {
  name: string
  color: string
  percentage: number
  votedUsers: any
  id: string
}

export type Vote = {
  id: string
  participant: {
    enrollment: {
      user_id: string
      profile: {
        first_name: string
        last_name: string
        avatar_url: string
      }
    }
  }
  response: VoteResponse
}
export type VoteResponse = {
  selected_options: string[]
  anonymous: boolean
}

export type PollFrame = IFrame & {
  content: {
    question: string
    options: PollOption[]
  }
}

export interface IReflectionFrame extends IFrame {
  content: {
    backgroundColor: string
    textColor: string
    title: string
    description?: string
  }
}

export type FrameAction = {
  key: string
  label: string
  icon: ReactNode
}

export interface MCQOption extends PollOption {
  selected?: boolean
}
export type MCQFrame = IFrame & {
  content: {
    question: string
    options: MCQOption[]
  }
}
