/* eslint-disable @typescript-eslint/no-explicit-any */

import { type AgendaFrameDisplayType } from './event.type'

import { ContentType } from '@/components/common/ContentTypePicker'

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
}

export interface IbreakoutRooms {
  name: string
  activityId?: string
}

export interface IFrame {
  id: string
  name: string
  content?: {
    title?: string
    description?: string
    blocks?: TextBlock[] | FileBlock[]
    panelSizes?: number[]
    breakoutRooms?: IbreakoutRooms[]
    activityId?: string
    groupActivityId?: string
    [key: string]: unknown
  }
  created_at?: string
  updated_at?: string
  config: any
  type: (typeof ContentType)[keyof typeof ContentType]
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
    }
  }
  response: {
    username: string
    reflection: string
    anonymous?: boolean
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
}

export interface PollPreviewOption {
  name: string
  color: string
  percentage: number
  votedUsers: any
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
