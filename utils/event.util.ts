import { IEventType } from '@/types/event.type'
import { IFrame } from '@/types/frame.type'

export type FrameStatusType = 'PUBLISHED' | 'DRAFT' | null

export const getFilteredFramesByStatus = ({
  frames,
  status,
}: {
  frames: IFrame[]
  status: FrameStatusType
}) =>
  frames.filter((frame) => {
    if (!status) return true

    return frame.status === status
  })

export const eventTypes: IEventType[] = [
  {
    label: 'Workshop',
    iconUrl: '/images/workshop.png',
    key: 'workshop',
    disabled: false,
    description: 'Showcase your unique skills and insights',
  },
  {
    label: 'Course',
    iconUrl: '/images/mentor.png',
    key: 'course',
    disabled: true,
    description: 'Empower others by sharing your valuable knowledge and skills',
  },
  {
    label: 'Blended Program',
    iconUrl: '/images/certificate.png',
    key: 'blended-program',
    disabled: true,
    description:
      'Combine interactive online modules with dynamic face-to-face sessions',
  },
]
