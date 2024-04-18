import { v4 as uuidv4 } from 'uuid'

import { ContentType } from '@/components/common/ContentTypePicker'
import { ISlide } from '@/types/slide.type'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDefaultContent = (contentType: ContentType, data?: any) => {
  switch (contentType) {
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
              html: `<p style="text-align: center">${data?.description || 'Description'}</p>`,
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
              html: `<h1>${data?.title || 'Title'}</h1>`,
            },
          },
          {
            id: uuidv4(),
            type: 'paragraph',
            data: {
              html: `<p>${data?.description || 'Description'}</p>`,
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
        ],
      }
    case ContentType.VIDEO:
      return {
        url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
      }
    case ContentType.POLL:
      return {
        question: '',
        options: ['', '', ''],
      }
    case ContentType.GOOGLE_SLIDES:
      return {
        googleSlideURL: '',
        startPosition: 1,
      }
    case ContentType.GOOGLE_SLIDES_IMPORT:
      return {
        googleSlideURL: '',
        startPosition: 1,
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
    backgroundColor: '#fff',
    textColor: '#000',
  },
  content: getDefaultContent(ContentType.COVER, { title, description }),
  type: ContentType.COVER,
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
  ].includes(slide.type)
