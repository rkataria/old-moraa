import { v4 as uuidv4 } from 'uuid'

import { FrameType } from './frame-picker.util'

import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
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
  frameType,
  data,
  templateKey,
}: {
  frameType: FrameType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  templateKey?: string
}) => {
  switch (frameType) {
    case FrameType.MORAA_SLIDE:
      return {
        defaultTemplate: templateKey,
        canvas: null,
      }
    case FrameType.COVER:
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

    case FrameType.TEXT_IMAGE:
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

    case FrameType.RICH_TEXT:
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

    case FrameType.VIDEO:
      return {
        url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.VIDEO_EMBED:
      return {
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.POLL:
      return {
        question: '',
        options: [
          {
            name: '',
            color: '#E7E0FF',
          },
          {
            name: '',
            color: '#E7E0FF',
          },
          {
            name: '',
            color: '#E7E0FF',
          },
        ],
        blocks: [paragraphBlock],
      }

    case FrameType.REFLECTION:
      return {
        blocks: [paragraphBlock],
      }

    case FrameType.GOOGLE_SLIDES:
      return {
        googleSlideURL: '',
        startPosition: 1,
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.GOOGLE_SLIDES_IMPORT:
      return {
        googleSlideURL: '',
        startPosition: 1,
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.PDF_VIEWER:
      return {
        googleSlideURL: '', // FIXME: This should be pdfURL
        startPosition: 1,
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.MIRO_EMBED:
      return {
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.MORAA_BOARD:
      return {
        blocks: [headerBlock, paragraphBlock],
      }
    case FrameType.BREAKOUT:
      return {
        blocks: [headerBlock, paragraphBlock],
        title: data?.title,
        description: data?.description,
        breakoutRooms:
          data?.breakoutType === BREAKOUT_TYPES.GROUPS
            ? undefined
            : new Array(data?.breakoutRoomsCount)
                .fill('')
                .map((_, idx) => ({ name: `Room - ${idx + 1}` })),
      }

    default:
      return {}
  }
}

export const isFrameInteractive = (frame: IFrame) =>
  [
    FrameType.POLL,
    FrameType.GOOGLE_SLIDES_IMPORT,
    FrameType.REFLECTION,
    FrameType.VIDEO_EMBED,
    FrameType.PDF_VIEWER,
    FrameType.MORAA_BOARD,
  ].includes(frame.type)

export const isFrameThumbnailAvailable = (frameType: FrameType) =>
  [
    FrameType.COVER,
    FrameType.TEXT_IMAGE,
    FrameType.IMAGE_VIEWER,
    FrameType.PDF_VIEWER,
    FrameType.POLL,
    FrameType.REFLECTION,
    FrameType.VIDEO_EMBED,
    FrameType.MIRO_EMBED,
    FrameType.RICH_TEXT,
  ].includes(frameType)

export const collaborativeTypes = [
  FrameType.POLL,
  FrameType.REFLECTION,
  FrameType.MORAA_BOARD,
  FrameType.BREAKOUT,
]
export const presentationTypes = [
  FrameType.MORAA_SLIDE,
  FrameType.RICH_TEXT,
  FrameType.COVER,
]
export const goodiesTypes = [
  FrameType.GOOGLE_SLIDES,
  FrameType.PDF_VIEWER,
  FrameType.MIRO_EMBED,
  FrameType.VIDEO_EMBED,
]
