import { v4 as uuidv4 } from 'uuid'

import { ContentType } from '@/components/event-content/ContentTypePicker'

export const getDefaultContent = (contentType: ContentType) => {
  switch (contentType) {
    case ContentType.COVER:
      return {
        title: 'Title',
        description: 'Description',
      }
    case ContentType.IMAGE:
      return {
        url: 'https://picsum.photos/200/300',
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
  content: {
    title,
    description,
  },
  type: ContentType.COVER,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkVoted = (votes: any, user: any) => {
  if (!Array.isArray(votes)) return false
  if (!user) return false

  return votes.some((vote) => vote.participant.enrollment.user_id === user.id)
}
