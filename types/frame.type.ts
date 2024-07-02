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

export interface IBreakoutDetails {
  name: string
  activityId?: string | null
}

export interface IFrame {
  id: string
  name: string
  content?: {
    title?: string
    description?: string
    blocks?: TextBlock[] | FileBlock[]
    panelSizes?: number[]
    breakoutDetails?: IBreakoutDetails[]
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

export interface IReflectionFrame extends IFrame {
  content: {
    backgroundColor: string
    textColor: string
    title: string
    description?: string
  }
}
