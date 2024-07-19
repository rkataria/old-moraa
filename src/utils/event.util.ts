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

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'success'
    default:
      return 'default'
  }
}

export const eventTableColumns = [
  {
    key: 'name',
    label: 'NAME',
    sortable: true,
  },
  {
    key: 'full_name',
    label: 'CREATOR',
    sortable: true,
  },
  {
    key: 'start_date',
    label: 'STARTS ON',
    sortable: true,
  },
  {
    key: 'end_date',
    label: 'ENDS AT',
    sortable: true,
  },
  {
    key: 'status',
    label: 'STATUS',
    sortable: true,
  },
  { key: 'actions', label: 'ACTIONS' },
]
