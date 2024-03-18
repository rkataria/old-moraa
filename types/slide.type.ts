/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnDragEndResponder } from 'react-beautiful-dnd'

import { ContentType } from '@/components/event-content/ContentTypePicker'

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

export type FileBlock = Block & {
  data: {
    file: {
      url: string
      meta: {
        name: string
        size: number
        type: string
      }
    }
  }
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
  status?: string
}

export type SlideManagerContextType = {
  slides: ISlide[]
  currentSlide: ISlide | null
  loading: boolean
  syncing: boolean
  miniMode: boolean
  isOwner: boolean
  setMiniMode: (miniMode: boolean) => void
  setCurrentSlide: (slide: ISlide) => void
  addNewSlide: (slide: ISlide) => void
  updateSlide: (slide: Partial<ISlide>) => void
  deleteSlide: (id: string) => void
  moveUpSlide: (id: string) => void
  moveDownSlide: (id: string) => void
  reorderSlide: OnDragEndResponder
}

export interface IMiniSlideManagerType {
  slide: ISlide
  index: number
  currentSlide: ISlide | null
  setCurrentSlide: (slide: ISlide) => void
  draggableProps: any
  mode: 'edit' | 'present' | 'read'
  miniSlideView: 'thumbnail' | 'list'
}
