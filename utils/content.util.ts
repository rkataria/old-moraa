import { v4 as uuidv4 } from 'uuid'

import { contentTypes } from '@/components/common/ContentTypePicker'
import { FrameStatus } from '@/services/types/enums'
import { IFrame } from '@/types/frame.type'

export const headerBlock = {
  id: uuidv4(),
  type: 'header',
  data: {
    html: '',
  },
}
export const paragraphBlock = {
  id: uuidv4(),
  type: 'paragraph',
  data: {
    html: '',
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDefaultContent = ({
  contentType,
  data,
  templateType,
}: {
  contentType: ContentType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  templateType?: CANVAS_TEMPLATE_TYPES
}) => {
  switch (contentType) {
    case ContentType.CANVAS:
      return {
        defaultTemplate: templateType,
        canvas: null,
      }
    case ContentType.COVER:
      return {
        blocks: [
          {
            id: uuidv4(),
            type: 'header',
            data: {
              html: `<h1 style="text-align: center">${data?.title || 'Title'}</h1>`,
            },
          },
          {
            id: uuidv4(),
            type: 'paragraph',
            data: {
              html: `<p style="text-align: center">${data?.description || 'This is a description text'}</p>`,
            },
          },
        ],
      }

    case ContentType.TEXT_IMAGE:
      return {
        blocks: [
          {
            id: uuidv4(),
            type: 'header',
            data: {
              html: '',
            },
          },
          {
            id: uuidv4(),
            type: 'paragraph',
            data: {
              html: '',
            },
          },
          {
            id: uuidv4(),
            type: 'image',
            data: {
              file: {
                url: 'https://images.unsplash.com/photo-1708947567920-316933385c73?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              },
            },
          },
        ],
      }

    case ContentType.RICH_TEXT:
      return {
        blocks: [
          {
            id: uuidv4(),
            type: 'richtext',
            data: {},
          },
          headerBlock,
          paragraphBlock,
        ],
      }

    case ContentType.VIDEO:
      return {
        url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
        blocks: [headerBlock, paragraphBlock],
      }

    case ContentType.VIDEO_EMBED:
      return {
        blocks: [headerBlock, paragraphBlock],
      }

    case ContentType.POLL:
      return {
        question: '',
        options: ['', '', ''],
        blocks: [paragraphBlock],
      }

    case ContentType.REFLECTION:
      return {
        blocks: [paragraphBlock],
      }

    case ContentType.GOOGLE_SLIDES:
      return {
        googleSlideURL: '',
        startPosition: 1,
        blocks: [headerBlock, paragraphBlock],
      }

    case ContentType.GOOGLE_SLIDES_IMPORT:
      return {
        googleSlideURL: '',
        startPosition: 1,
        blocks: [headerBlock, paragraphBlock],
      }

    case ContentType.PDF_VIEWER:
      return {
        googleSlideURL: '', // FIXME: This should be pdfURL
        startPosition: 1,
        blocks: [headerBlock, paragraphBlock],
      }

    case ContentType.MIRO_EMBED:
      return {
        blocks: [headerBlock, paragraphBlock],
      }

    case ContentType.MORAA_BOARD:
      return {
        blocks: [headerBlock, paragraphBlock],
      }
    case ContentType.BREAKOUT:
      return {
        blocks: [headerBlock, paragraphBlock],
        title: data?.title,
        description: data?.description,
        breakoutDetails: [...Array(data?.breakoutCount)]
          .fill('')
          .map((_, idx) => ({
            name: `${data?.selectedBreakout} - ${idx + 1}`,
          })),
      }

    default:
      return {}
  }
}

export const getDefaultCoverFrame = ({
  name = 'Frame 1',
  title = 'Title',
  description = 'Description',
}: {
  name?: string
  title?: string
  description?: string
}) => ({
  id: uuidv4(),
  name,
  config: {
    textColor: '#000',
    showTitle: true,
    showDescription: true,
  },
  content: getDefaultContent({
    contentType: ContentType.COVER,
    data: { title, description },
  }),
  type: ContentType.COVER,
  status: FrameStatus.PUBLISHED,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkVoted = (votes: any, user: any) => {
  if (!Array.isArray(votes)) return false
  if (!user) return false

  return votes.some((vote) => vote.participant.enrollment.user_id === user.id)
}

export const isFrameInteractive = (frame: IFrame) =>
  [
    ContentType.POLL,
    ContentType.GOOGLE_SLIDES_IMPORT,
    ContentType.REFLECTION,
    ContentType.VIDEO_EMBED,
    ContentType.PDF_VIEWER,
    ContentType.MORAA_BOARD,
  ].includes(frame.type)

export const frameHasFrameResponses = (frame: IFrame) =>
  [ContentType.POLL, ContentType.REFLECTION].includes(frame.type)

export const getContentType = (
  frameType: ContentType,
  templateType?: CANVAS_TEMPLATE_TYPES
) => {
  if (templateType) {
    return contentTypes.find(
      (type) =>
        type.contentType === frameType && type.templateType === templateType
    )
  }

  return contentTypes.find((type) => type.contentType === frameType)
}

export const isFrameThumbnailAvailable = (frameType: ContentType) =>
  [
    ContentType.COVER,
    ContentType.TEXT_IMAGE,
    ContentType.IMAGE_VIEWER,
    ContentType.PDF_VIEWER,
    ContentType.POLL,
    ContentType.REFLECTION,
    ContentType.VIDEO_EMBED,
    ContentType.MIRO_EMBED,
    ContentType.RICH_TEXT,
  ].includes(frameType)

export enum ContentType {
  CANVAS = 'Canvas',
  COVER = 'Title',
  POLL = 'Poll',
  VIDEO = 'Video',
  GOOGLE_SLIDES = 'Google Slides',
  GOOGLE_SLIDES_IMPORT = 'Google Slides Import',
  REFLECTION = 'Reflections',
  PDF_VIEWER = 'PDF',
  VIDEO_EMBED = 'Video Embed',
  MIRO_EMBED = 'Miro Embed',
  IMAGE_VIEWER = 'Image',
  TEXT_IMAGE = 'Text & Image',
  RICH_TEXT = 'Rich Text',
  MORAA_BOARD = 'Moraa Board',
  BREAKOUT = 'Breakout',
}

export enum CANVAS_TEMPLATE_TYPES {
  BLANK = 'Blank',
  TEMPLATE_ONE = 'Template One',
  TEMPLATE_TWO = 'Template Two',
  TEMPLATE_THREE = 'Template Three',
}

export interface IContentType {
  name: string
  icon: React.ReactNode
  description: string
  contentType: ContentType
  disabled?: boolean
  templateType?: CANVAS_TEMPLATE_TYPES
}
