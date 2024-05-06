/* eslint-disable @typescript-eslint/no-explicit-any */

import { type AgendaSlideDisplayType } from './event.type'

import { ContentType } from '@/components/common/ContentTypePicker'

export type SlideMode = 'edit' | 'present'

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
  slides: ISlide[]
  meeting_id?: string
  status?: string
}

export interface ISlide {
  id: string
  name: string
  content?: {
    title?: string
    description?: string
    blocks?: TextBlock[] | FileBlock[]
    panelSizes?: number[]
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
}

export interface IMiniSlideManagerType {
  slide: ISlide
  index: number
  slideCount: number
  draggableProps: any
  displayType: AgendaSlideDisplayType
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

export interface IReflectionSlide extends ISlide {
  content: {
    backgroundColor: string
    textColor: string
    title: string
    description?: string
  }
}
