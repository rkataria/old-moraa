import { v4 as uuidv4 } from 'uuid'

import {
  CANVAS_TEMPLATE_TYPES,
  ContentType,
  contentTypes,
} from '@/components/common/ContentTypePicker'
import { SlideStatus } from '@/services/types/enums'
import { ISlide } from '@/types/slide.type'

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
        googleSlideURL: '',
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

    default:
      return {}
  }
}

export const getDefaultCoverSlide = ({
  name = 'Slide 1',
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
  status: SlideStatus.PUBLISHED,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkVoted = (votes: any, user: any) => {
  if (!Array.isArray(votes)) return false
  if (!user) return false

  return votes.some((vote) => vote.participant.enrollment.user_id === user.id)
}

export const isSlideInteractive = (slide: ISlide) =>
  [
    ContentType.POLL,
    ContentType.GOOGLE_SLIDES_IMPORT,
    ContentType.REFLECTION,
    ContentType.VIDEO_EMBED,
    ContentType.PDF_VIEWER,
    ContentType.MORAA_BOARD,
  ].includes(slide.type)

export const slideHasSlideResponses = (slide: ISlide) =>
  [ContentType.POLL, ContentType.REFLECTION].includes(slide.type)

export const getContentType = (slideType: ContentType) =>
  contentTypes.find((type) => type.contentType === slideType)

export const isSlideThumbnailAvailable = (slideType: ContentType) =>
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
  ].includes(slideType)
